import { zodResolver } from '@hookform/resolvers/zod';
import {
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
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import {
  orderStep1Schema,
  type OrderStep1FormData,
} from '../../schemas/orderSchema';
//import type { Product } from '../../types/product';
import { formatCurrency } from '../../utils/formatters';

interface OrderItemRow {
  id: string;
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

const statusOptions = [
  { label: 'Pendente', value: 'pending' },
  { label: 'Aprovado', value: 'approved' },
];

export function OrderFormPage() {
  const navigate = useNavigate();

  const products = useAppSelector((state) => state.products.items);

  const activeProducts = useMemo(() => {
    return products.filter((product) => product.active);
  }, [products]);

  const productOptions = activeProducts.map((product) => ({
    label: `${product.name} - ${formatCurrency(product.price)}`,
    value: product.id,
  }));

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrderStep1FormData>({
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');

  const itemRows: OrderItemRow[] = fields.map((field, index) => {
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

  function handleProductChange(productId: string, index: number) {
    const product = products.find((item) => item.id === productId);

    setValue(`items.${index}.productId`, productId, {
      shouldValidate: true,
    });

    setValue(`items.${index}.unitPrice`, product?.price ?? 0, {
      shouldValidate: true,
    });
  }

  function handleStep1Submit(data: OrderStep1FormData) {
    console.log('Step 1 data:', data);
  }

  const columns: ColumnsType<OrderItemRow> = [
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
        current={0}
        items={[
          { title: 'Itens' },
          { title: 'Pagamento' },
        ]}
      />

      <Card>
        <Form layout="vertical" onFinish={handleSubmit(handleStep1Submit)}>
          <Form.Item
            label="Nome do cliente"
            validateStatus={errors.customerName ? 'error' : undefined}
            help={errors.customerName?.message}
            required
          >
            <Controller
              name="customerName"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Status inicial"
            validateStatus={errors.status ? 'error' : undefined}
            help={errors.status?.message}
            required
          >
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select {...field} options={statusOptions} />
              )}
            />
          </Form.Item>

          <Typography.Title level={4}>Itens do pedido</Typography.Title>

          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {fields.map((field, index) => {
              const currentItem = watchedItems[index];
              const currentSubtotal =
                (currentItem?.quantity ?? 0) * (currentItem?.unitPrice ?? 0);

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
                        errors.items?.[index]?.productId ? 'error' : undefined
                      }
                      help={errors.items?.[index]?.productId?.message}
                      required
                    >
                      <Controller
                        name={`items.${index}.productId`}
                        control={control}
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
                        errors.items?.[index]?.quantity ? 'error' : undefined
                      }
                      help={errors.items?.[index]?.quantity?.message}
                      required
                    >
                      <Controller
                        name={`items.${index}.quantity`}
                        control={control}
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
                        control={control}
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
                        disabled={fields.length === 1}
                        onClick={() => remove(index)}
                      >
                        Remover item
                      </Button>
                    </div>
                  </Space>
                </Card>
              );
            })}

            {errors.items?.root?.message ? (
              <Typography.Text type="danger">
                {errors.items.root.message}
              </Typography.Text>
            ) : null}

            <Button
              onClick={() =>
                append({
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
            columns={columns}
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
    </Space>
  );
}