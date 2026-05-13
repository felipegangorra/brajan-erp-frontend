import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Steps,
  Table,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  orderStep1Schema,
  orderStep2Schema,
  type OrderStep1FormData,
  type OrderStep2FormData,
} from '../../schemas/orderSchema';
import type { OrderItem, OrderPayment } from '../../types/order';
import type { PaymentMethodType } from '../../types/payment-method';
import {
  calcInstallmentValue,
  formatCurrency,
} from '../../utils/formatters';
import { addOrder } from './ordersSlice';

interface OrderItemRow {
  id: string;
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface PaymentRow {
  id: string;
  paymentMethodId: string;
  paymentMethodName: string;
  paymentMethodType?: PaymentMethodType;
  installments: number;
  amount: number;
  installmentValue: number;
}

const statusOptions = [
  { label: 'Pendente', value: 'pending' },
  { label: 'Aprovado', value: 'approved' },
];

export function OrderFormPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const products = useAppSelector((state) => state.products.items);
  const paymentMethods = useAppSelector((state) => state.paymentMethods.items);

  const [currentStep, setCurrentStep] = useState(0);
  const [step1Data, setStep1Data] = useState<OrderStep1FormData | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const activeProducts = useMemo(() => {
    return products.filter((product) => product.active);
  }, [products]);

  const activePaymentMethods = useMemo(() => {
    return paymentMethods.filter((paymentMethod) => paymentMethod.active);
  }, [paymentMethods]);

  const productOptions = activeProducts.map((product) => ({
    label: `${product.name} - ${formatCurrency(product.price)}`,
    value: product.id,
  }));

  const paymentMethodOptions = activePaymentMethods.map((paymentMethod) => ({
    label: paymentMethod.name,
    value: paymentMethod.id,
  }));

  const step1Form = useForm<OrderStep1FormData>({
    resolver: zodResolver(orderStep1Schema),
    defaultValues: {
      customerName: '',
      status: 'pending',
      items: [
        {
          productId: '',
          quantity: 1,
          unitPrice: 0,
        },
      ],
    },
  });

  const step2Form = useForm<OrderStep2FormData>({
    resolver: zodResolver(orderStep2Schema),
    defaultValues: {
      payments: [
        {
          paymentMethodId: '',
          installments: 1,
          amount: 0,
        },
      ],
    },
  });

  const {
    control: step1Control,
    handleSubmit: handleStep1Submit,
    setValue: setStep1Value,
    formState: { errors: step1Errors },
  } = step1Form;

  const {
    control: step2Control,
    handleSubmit: handleStep2Submit,
    setValue: setStep2Value,
    formState: { errors: step2Errors },
  } = step2Form;

  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control: step1Control,
    name: 'items',
  });

  const {
    fields: paymentFields,
    append: appendPayment,
    remove: removePayment,
  } = useFieldArray({
    control: step2Control,
    name: 'payments',
  });

  const watchedItems = useWatch({
    control: step1Control,
    name: 'items',
  });

  const watchedPayments = useWatch({
    control: step2Control,
    name: 'payments',
  });

  const itemRows: OrderItemRow[] = itemFields.map((field, index) => {
    const item = watchedItems[index];
    const product = products.find(
      (currentProduct) => currentProduct.id === item?.productId,
    );

    const quantity = item?.quantity ?? 0;
    const unitPrice = item?.unitPrice ?? 0;

    return {
      id: field.id,
      productId: item?.productId ?? '',
      productName: product?.name ?? '-',
      unit: product?.unit ?? '-',
      quantity,
      unitPrice,
      subtotal: quantity * unitPrice,
    };
  });

  const orderTotal = itemRows.reduce((total, item) => total + item.subtotal, 0);

  const paymentRows: PaymentRow[] = paymentFields.map((field, index) => {
    const payment = watchedPayments[index];
    const paymentMethod = paymentMethods.find(
      (currentPaymentMethod) =>
        currentPaymentMethod.id === payment?.paymentMethodId,
    );

    const amount = payment?.amount ?? 0;
    const installments = payment?.installments ?? 1;

    return {
      id: field.id,
      paymentMethodId: payment?.paymentMethodId ?? '',
      paymentMethodName: paymentMethod?.name ?? '-',
      paymentMethodType: paymentMethod?.type,
      installments,
      amount,
      installmentValue: calcInstallmentValue(amount, installments),
    };
  });

  const informedPaymentTotal = paymentRows.reduce(
    (total, payment) => total + payment.amount,
    0,
  );

  const paymentDifference = Number(
    (orderTotal - informedPaymentTotal).toFixed(2),
  );

  function handleProductChange(productId: string, index: number) {
    const product = products.find((item) => item.id === productId);

    setStep1Value(`items.${index}.productId`, productId, {
      shouldValidate: true,
    });

    setStep1Value(`items.${index}.unitPrice`, product?.price ?? 0, {
      shouldValidate: true,
    });
  }

  function handlePaymentMethodChange(paymentMethodId: string, index: number) {
    const paymentMethod = paymentMethods.find(
      (item) => item.id === paymentMethodId,
    );

    setStep2Value(`payments.${index}.paymentMethodId`, paymentMethodId, {
      shouldValidate: true,
    });

    if (paymentMethod?.type !== 'credit_card') {
      setStep2Value(`payments.${index}.installments`, 1, {
        shouldValidate: true,
      });
    }
  }

  function getSelectedPaymentMethodType(index: number) {
    const paymentMethodId = watchedPayments[index]?.paymentMethodId;

    return paymentMethods.find(
      (paymentMethod) => paymentMethod.id === paymentMethodId,
    )?.type;
  }

  function validateDuplicatedPaymentMethods(payments: OrderStep2FormData['payments']) {
    const selectedPaymentMethodIds = payments
      .map((payment) => payment.paymentMethodId)
      .filter(Boolean);

    return new Set(selectedPaymentMethodIds).size !== selectedPaymentMethodIds.length;
  }

  function validatePaymentTotal() {
    const orderTotalInCents = Math.round(orderTotal * 100);
    const paymentTotalInCents = Math.round(informedPaymentTotal * 100);

    return orderTotalInCents === paymentTotalInCents;
  }

  function onStep1Submit(data: OrderStep1FormData) {
    setStep1Data(data);
    setPaymentError(null);
    setCurrentStep(1);
  }

  function onStep2Submit(data: OrderStep2FormData) {
    setPaymentError(null);

    if (!step1Data) {
      setPaymentError('Dados dos itens não encontrados');
      setCurrentStep(0);
      return;
    }

    if (validateDuplicatedPaymentMethods(data.payments)) {
      setPaymentError('Forma de pagamento já adicionada');
      return;
    }

    if (!validatePaymentTotal()) {
      setPaymentError('Valor dos pagamentos difere do total do pedido');
      return;
    }

    const orderItems: OrderItem[] = step1Data.items.map((item) => {
      const product = products.find(
        (currentProduct) => currentProduct.id === item.productId,
      );

      return {
        productId: item.productId,
        productName: product?.name ?? '',
        unit: product?.unit ?? '',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      };
    });

    const orderPayments: OrderPayment[] = data.payments.map((payment) => {
      const paymentMethod = paymentMethods.find(
        (currentPaymentMethod) =>
          currentPaymentMethod.id === payment.paymentMethodId,
      );

      return {
        paymentMethodId: payment.paymentMethodId,
        paymentMethodName: paymentMethod?.name ?? '',
        installments:
          paymentMethod?.type === 'credit_card' ? payment.installments : 1,
        amount: payment.amount,
      };
    });

    dispatch(
      addOrder({
        id: uuid(),
        customerName: step1Data.customerName,
        status: step1Data.status,
        items: orderItems,
        payments: orderPayments,
        createdAt: new Date().toISOString(),
      }),
    );

    message.success('Pedido criado com sucesso!');
    navigate('/orders');
  }

  const itemColumns: ColumnsType<OrderItemRow> = [
    {
      title: 'Produto',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Unidade',
      dataIndex: 'unit',
      key: 'unit',
      width: 100,
    },
    {
      title: 'Quantidade',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
    },
    {
      title: 'Preço unitário',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (value: number) => formatCurrency(value),
    },
  ];

  const paymentColumns: ColumnsType<PaymentRow> = [
    {
      title: 'Forma de pagamento',
      dataIndex: 'paymentMethodName',
      key: 'paymentMethodName',
    },
    {
      title: 'Parcelas',
      dataIndex: 'installments',
      key: 'installments',
      width: 120,
    },
    {
      title: 'Valor',
      dataIndex: 'amount',
      key: 'amount',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Valor por parcela',
      dataIndex: 'installmentValue',
      key: 'installmentValue',
      render: (value: number) => formatCurrency(value),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 0 }}>
          Novo pedido
        </Typography.Title>
        <Typography.Text type="secondary">
          Crie um pedido comercial com itens e pagamentos vinculados.
        </Typography.Text>
      </div>

      <Steps
        current={currentStep}
        items={[{ title: 'Itens' }, { title: 'Pagamento' }]}
      />

      {currentStep === 0 ? (
        <Card>
          <Form layout="vertical" onFinish={handleStep1Submit(onStep1Submit)}>
            <Form.Item
              label="Nome do cliente"
              validateStatus={step1Errors.customerName ? 'error' : undefined}
              help={step1Errors.customerName?.message}
              required
            >
              <Controller
                name="customerName"
                control={step1Control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>

            <Form.Item
              label="Status inicial"
              validateStatus={step1Errors.status ? 'error' : undefined}
              help={step1Errors.status?.message}
              required
            >
              <Controller
                name="status"
                control={step1Control}
                render={({ field }) => (
                  <Select {...field} options={statusOptions} />
                )}
              />
            </Form.Item>

            <Typography.Title level={4}>Itens do pedido</Typography.Title>

            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {itemFields.map((field, index) => {
                const currentItem = watchedItems[index];
                const currentSubtotal =
                  (currentItem?.quantity ?? 0) *
                  (currentItem?.unitPrice ?? 0);

                return (
                  <Card key={field.id} size="small">
                    <Space
                      direction="vertical"
                      size="middle"
                      style={{ width: '100%' }}
                    >
                      <Form.Item
                        label="Produto"
                        validateStatus={
                          step1Errors.items?.[index]?.productId
                            ? 'error'
                            : undefined
                        }
                        help={step1Errors.items?.[index]?.productId?.message}
                        required
                      >
                        <Controller
                          name={`items.${index}.productId`}
                          control={step1Control}
                          render={({ field: controllerField }) => (
                            <Select
                              {...controllerField}
                              showSearch
                              placeholder="Selecione um produto"
                              options={productOptions}
                              optionFilterProp="label"
                              onChange={(value) =>
                                handleProductChange(value, index)
                              }
                            />
                          )}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Quantidade"
                        validateStatus={
                          step1Errors.items?.[index]?.quantity
                            ? 'error'
                            : undefined
                        }
                        help={step1Errors.items?.[index]?.quantity?.message}
                        required
                      >
                        <Controller
                          name={`items.${index}.quantity`}
                          control={step1Control}
                          render={({ field: controllerField }) => (
                            <InputNumber
                              {...controllerField}
                              min={1}
                              precision={0}
                              style={{ width: '100%' }}
                              onChange={(value) =>
                                controllerField.onChange(value ?? 1)
                              }
                            />
                          )}
                        />
                      </Form.Item>

                      <Form.Item label="Preço unitário">
                        <Controller
                          name={`items.${index}.unitPrice`}
                          control={step1Control}
                          render={({ field: controllerField }) => (
                            <InputNumber
                              {...controllerField}
                              readOnly
                              disabled
                              precision={2}
                              style={{ width: '100%' }}
                            />
                          )}
                        />
                      </Form.Item>

                      <Typography.Text strong>
                        Subtotal: {formatCurrency(currentSubtotal)}
                      </Typography.Text>

                      <div>
                        <Button
                          danger
                          disabled={itemFields.length === 1}
                          onClick={() => removeItem(index)}
                        >
                          Remover item
                        </Button>
                      </div>
                    </Space>
                  </Card>
                );
              })}

              {step1Errors.items?.root?.message ? (
                <Typography.Text type="danger">
                  {step1Errors.items.root.message}
                </Typography.Text>
              ) : null}

              <Button
                onClick={() =>
                  appendItem({
                    productId: '',
                    quantity: 1,
                    unitPrice: 0,
                  })
                }
              >
                Adicionar item
              </Button>
            </Space>

            <Card style={{ marginTop: 24 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Typography.Text strong>Total geral</Typography.Text>
                <Typography.Title level={3} style={{ margin: 0 }}>
                  {formatCurrency(orderTotal)}
                </Typography.Title>
              </Space>
            </Card>

            <Table
              style={{ marginTop: 24 }}
              rowKey="id"
              columns={itemColumns}
              dataSource={itemRows}
              pagination={false}
            />

            <Space style={{ marginTop: 24 }}>
              <Button type="primary" htmlType="submit">
                Continuar para pagamento
              </Button>

              <Button onClick={() => navigate('/orders')}>Cancelar</Button>
            </Space>
          </Form>
        </Card>
      ) : (
        <Card>
          <Form layout="vertical" onFinish={handleStep2Submit(onStep2Submit)}>
            <Card style={{ marginBottom: 24 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Typography.Text strong>Total do pedido</Typography.Text>
                <Typography.Title level={3} style={{ margin: 0 }}>
                  {formatCurrency(orderTotal)}
                </Typography.Title>
              </Space>
            </Card>

            <Typography.Title level={4}>Pagamentos</Typography.Title>

            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {paymentFields.map((field, index) => {
                const selectedPaymentMethodType =
                  getSelectedPaymentMethodType(index);
                const isCreditCard =
                  selectedPaymentMethodType === 'credit_card';

                const currentPayment = watchedPayments[index];
                const currentInstallmentValue = calcInstallmentValue(
                  currentPayment?.amount ?? 0,
                  currentPayment?.installments ?? 1,
                );

                return (
                  <Card key={field.id} size="small">
                    <Space
                      direction="vertical"
                      size="middle"
                      style={{ width: '100%' }}
                    >
                      <Form.Item
                        label="Forma de pagamento"
                        validateStatus={
                          step2Errors.payments?.[index]?.paymentMethodId
                            ? 'error'
                            : undefined
                        }
                        help={
                          step2Errors.payments?.[index]?.paymentMethodId
                            ?.message
                        }
                        required
                      >
                        <Controller
                          name={`payments.${index}.paymentMethodId`}
                          control={step2Control}
                          render={({ field: controllerField }) => (
                            <Select
                              {...controllerField}
                              placeholder="Selecione uma forma de pagamento"
                              options={paymentMethodOptions}
                              onChange={(value) =>
                                handlePaymentMethodChange(value, index)
                              }
                            />
                          )}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Parcelas"
                        validateStatus={
                          step2Errors.payments?.[index]?.installments
                            ? 'error'
                            : undefined
                        }
                        help={
                          step2Errors.payments?.[index]?.installments?.message
                        }
                        required
                      >
                        <Controller
                          name={`payments.${index}.installments`}
                          control={step2Control}
                          render={({ field: controllerField }) => (
                            <InputNumber
                              {...controllerField}
                              min={1}
                              max={
                                paymentMethods.find(
                                  (paymentMethod) =>
                                    paymentMethod.id ===
                                    watchedPayments[index]?.paymentMethodId,
                                )?.maxInstallments ?? 1
                              }
                              precision={0}
                              disabled={!isCreditCard}
                              style={{ width: '100%' }}
                              onChange={(value) =>
                                controllerField.onChange(value ?? 1)
                              }
                            />
                          )}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Valor"
                        validateStatus={
                          step2Errors.payments?.[index]?.amount
                            ? 'error'
                            : undefined
                        }
                        help={step2Errors.payments?.[index]?.amount?.message}
                        required
                      >
                        <Controller
                          name={`payments.${index}.amount`}
                          control={step2Control}
                          render={({ field: controllerField }) => (
                            <InputNumber
                              {...controllerField}
                              min={0}
                              precision={2}
                              decimalSeparator=","
                              style={{ width: '100%' }}
                              onChange={(value) =>
                                controllerField.onChange(value ?? 0)
                              }
                            />
                          )}
                        />
                      </Form.Item>

                      <Typography.Text strong>
                        Valor por parcela:{' '}
                        {formatCurrency(currentInstallmentValue)}
                      </Typography.Text>

                      <div>
                        <Button
                          danger
                          disabled={paymentFields.length === 1}
                          onClick={() => removePayment(index)}
                        >
                          Remover pagamento
                        </Button>
                      </div>
                    </Space>
                  </Card>
                );
              })}

              {step2Errors.payments?.root?.message ? (
                <Typography.Text type="danger">
                  {step2Errors.payments.root.message}
                </Typography.Text>
              ) : null}

              <Button
                onClick={() =>
                  appendPayment({
                    paymentMethodId: '',
                    installments: 1,
                    amount: 0,
                  })
                }
              >
                Adicionar pagamento
              </Button>
            </Space>

            <Card style={{ marginTop: 24 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Typography.Text>
                  Total do pedido: <strong>{formatCurrency(orderTotal)}</strong>
                </Typography.Text>

                <Typography.Text>
                  Total informado:{' '}
                  <strong>{formatCurrency(informedPaymentTotal)}</strong>
                </Typography.Text>

                <Typography.Text
                  type={paymentDifference === 0 ? 'success' : 'danger'}
                >
                  Diferença:{' '}
                  <strong>{formatCurrency(paymentDifference)}</strong>
                </Typography.Text>
              </Space>
            </Card>

            <Table
              style={{ marginTop: 24 }}
              rowKey="id"
              columns={paymentColumns}
              dataSource={paymentRows}
              pagination={false}
            />

            {paymentError ? (
              <Alert
                style={{ marginTop: 24 }}
                type="error"
                message={paymentError}
                showIcon
              />
            ) : null}

            <Space style={{ marginTop: 24 }}>
              <Button onClick={() => setCurrentStep(0)}>Voltar</Button>

              <Button type="primary" htmlType="submit">
                Criar pedido
              </Button>

              <Button onClick={() => navigate('/orders')}>Cancelar</Button>
            </Space>
          </Form>
        </Card>
      )}
    </Space>
  );
}