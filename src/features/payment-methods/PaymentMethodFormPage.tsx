import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Switch,
  Typography,
  message,
} from 'antd';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { useAppDispatch } from '../../app/hooks';
import {
  paymentMethodSchema,
  type PaymentMethodFormData,
} from '../../schemas/paymentMethodSchema';
import type { PaymentMethodType } from '../../types/payment-method';
import { addPaymentMethod } from './paymentMethodsSlice';

const paymentTypeOptions: Array<{
  label: string;
  value: PaymentMethodType;
}> = [
  { label: 'Dinheiro', value: 'money' },
  { label: 'Cartão de crédito', value: 'credit_card' },
  { label: 'Cartão de débito', value: 'debit_card' },
  { label: 'Pix', value: 'pix' },
  { label: 'Boleto', value: 'boleto' },
];

export function PaymentMethodFormPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      name: '',
      type: 'money',
      maxInstallments: 1,
      active: true,
    },
  });

  const selectedType = useWatch({
  control,
  name: 'type',
  });
  const isCreditCard = selectedType === 'credit_card';

  function handleTypeChange(type: PaymentMethodType) {
    setValue('type', type, { shouldValidate: true });

    if (type !== 'credit_card') {
      setValue('maxInstallments', 1, { shouldValidate: true });
    }
  }

  function onSubmit(data: PaymentMethodFormData) {
    dispatch(
      addPaymentMethod({
        id: uuid(),
        name: data.name,
        type: data.type,
        maxInstallments:
          data.type === 'credit_card' ? data.maxInstallments : 1,
        active: data.active,
      }),
    );

    message.success('Forma de pagamento cadastrada com sucesso!');
    navigate('/payment-methods');
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 0 }}>
          Nova forma de pagamento
        </Typography.Title>
        <Typography.Text type="secondary">
          Preencha os dados para cadastrar uma nova forma de pagamento.
        </Typography.Text>
      </div>

      <Card>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="Nome"
            validateStatus={errors.name ? 'error' : undefined}
            help={errors.name?.message}
            required
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Tipo"
            validateStatus={errors.type ? 'error' : undefined}
            help={errors.type?.message}
            required
          >
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={paymentTypeOptions}
                  onChange={handleTypeChange}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Máx. parcelas"
            validateStatus={errors.maxInstallments ? 'error' : undefined}
            help={errors.maxInstallments?.message}
            required
          >
            <Controller
              name="maxInstallments"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={1}
                  max={24}
                  precision={0}
                  disabled={!isCreditCard}
                  style={{ width: '100%' }}
                  onChange={(value) => field.onChange(value ?? 1)}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Ativo"
            validateStatus={errors.active ? 'error' : undefined}
            help={errors.active?.message}
          >
            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onChange={field.onChange} />
              )}
            />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Salvar
            </Button>

            <Button onClick={() => navigate('/payment-methods')}>
              Cancelar
            </Button>
          </Space>
        </Form>
      </Card>
    </Space>
  );
}