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
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { useAppDispatch } from '../../app/hooks';
import {
  productSchema,
  type ProductFormData,
} from '../../schemas/productSchema';
import { addProduct } from './productsSlice';

const unitOptions = [
  { label: 'un', value: 'un' },
  { label: 'kg', value: 'kg' },
  { label: 'cx', value: 'cx' },
  { label: 'm', value: 'm' },
  { label: 'l', value: 'l' },
];

export function ProductFormPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      unit: 'un',
      price: 0,
      stock: 0,
      active: true,
    },
  });

  function onSubmit(data: ProductFormData) {
    dispatch(
      addProduct({
        id: uuid(),
        name: data.name,
        description: data.description ?? '',
        unit: data.unit,
        price: data.price,
        stock: data.stock,
        active: data.active,
        createdAt: new Date().toISOString(),
      }),
    );

    message.success('Produto cadastrado com sucesso!');
    navigate('/products');
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 0 }}>
          Novo produto
        </Typography.Title>
        <Typography.Text type="secondary">
          Preencha os dados para cadastrar um novo produto.
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
            label="Descrição"
            validateStatus={errors.description ? 'error' : undefined}
            help={errors.description?.message}
          >
            <Controller
              name="description"
              control={control}
              render={({ field }) => <Input.TextArea {...field} rows={4} />}
            />
          </Form.Item>

          <Form.Item
            label="Unidade"
            validateStatus={errors.unit ? 'error' : undefined}
            help={errors.unit?.message}
            required
          >
            <Controller
              name="unit"
              control={control}
              render={({ field }) => (
                <Select {...field} options={unitOptions} />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Preço unitário"
            validateStatus={errors.price ? 'error' : undefined}
            help={errors.price?.message}
            required
          >
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0}
                  precision={2}
                  decimalSeparator=","
                  style={{ width: '100%' }}
                  onChange={(value) => field.onChange(value ?? 0)}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Estoque inicial"
            validateStatus={errors.stock ? 'error' : undefined}
            help={errors.stock?.message}
            required
          >
            <Controller
              name="stock"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0}
                  precision={0}
                  style={{ width: '100%' }}
                  onChange={(value) => field.onChange(value ?? 0)}
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

            <Button onClick={() => navigate('/products')}>Cancelar</Button>
          </Space>
        </Form>
      </Card>
    </Space>
  );
}