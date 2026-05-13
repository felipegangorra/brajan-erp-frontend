import { Button, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import type { Product } from '../../types/product';
import { formatCurrency } from '../../utils/formatters';
import { deactivateProduct } from './productsSlice';

export function ProductsPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);

  const columns: ColumnsType<Product> = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Unidade',
      dataIndex: 'unit',
      key: 'unit',
      width: 100,
    },
    {
      title: 'Preço',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatCurrency(price),
    },
    {
      title: 'Estoque',
      dataIndex: 'stock',
      key: 'stock',
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      width: 120,
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? 'Ativo' : 'Inativo'}
        </Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 180,
      render: (_, product) => (
        <Space>
          <Button size="small" disabled>
            Editar
          </Button>

          <Popconfirm
            title="Inativar produto"
            description="Deseja inativar este produto?"
            okText="Sim"
            cancelText="Não"
            disabled={!product.active}
            onConfirm={() => dispatch(deactivateProduct(product.id))}
          >
            <Button size="small" danger disabled={!product.active}>
              Inativar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Space
        align="center"
        style={{ width: '100%', justifyContent: 'space-between' }}
      >
        <div>
          <Typography.Title level={2} style={{ marginBottom: 0 }}>
            Produtos
          </Typography.Title>
          <Typography.Text type="secondary">
            Cadastro e controle de produtos disponíveis para pedidos.
          </Typography.Text>
        </div>

        <Link to="/products/new">
          <Button type="primary">Novo produto</Button>
        </Link>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={products}
        pagination={{ pageSize: 8 }}
      />
    </Space>
  );
}