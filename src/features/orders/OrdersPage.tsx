import { Button, Input, Select, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import type { Order, OrderStatus } from '../../types/order';
import {
  calcOrderTotal,
  formatCurrency,
  formatDate,
  isPaymentComplete,
} from '../../utils/formatters';

const orderStatusLabels: Record<OrderStatus, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  shipped: 'Enviado',
  cancelled: 'Cancelado',
};

const orderStatusColors: Record<OrderStatus, string> = {
  pending: 'orange',
  approved: 'blue',
  shipped: 'green',
  cancelled: 'red',
};

const statusFilterOptions: Array<{
  label: string;
  value: OrderStatus | 'all';
}> = [
  { label: 'Todos', value: 'all' },
  { label: 'Pendente', value: 'pending' },
  { label: 'Aprovado', value: 'approved' },
  { label: 'Enviado', value: 'shipped' },
  { label: 'Cancelado', value: 'cancelled' },
];

export function OrdersPage() {
  const orders = useAppSelector((state) => state.orders.items);

  const [customerSearch, setCustomerSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const filteredOrders = useMemo(() => {
    const normalizedSearch = customerSearch.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesCustomer = order.customerName
        .toLowerCase()
        .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === 'all' || order.status === statusFilter;

      return matchesCustomer && matchesStatus;
    });
  }, [orders, customerSearch, statusFilter]);

  const columns: ColumnsType<Order> = [
    {
      title: '# Pedido',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string) => id.slice(0, 8),
    },
    {
      title: 'Cliente',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Data',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => formatDate(createdAt),
    },
    {
      title: 'Total',
      key: 'total',
      render: (_, order) => formatCurrency(calcOrderTotal(order.items)),
    },
    {
      title: 'Pagamento',
      key: 'payment',
      width: 130,
      render: (_, order) => {
        const complete = isPaymentComplete(order);

        return (
          <Tag color={complete ? 'green' : 'orange'}>
            {complete ? 'Completo' : 'Pendente'}
          </Tag>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: OrderStatus) => (
        <Tag color={orderStatusColors[status]}>
          {orderStatusLabels[status]}
        </Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 140,
      render: () => (
        <Button size="small" disabled>
          Ver detalhes
        </Button>
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
            Pedidos
          </Typography.Title>
          <Typography.Text type="secondary">
            Gestão dos pedidos comerciais e seus pagamentos vinculados.
          </Typography.Text>
        </div>

        <Link to="/orders/new">
          <Button type="primary">Novo pedido</Button>
        </Link>
      </Space>

      <Space wrap>
        <Input.Search
          allowClear
          placeholder="Buscar por cliente"
          style={{ width: 280 }}
          value={customerSearch}
          onChange={(event) => setCustomerSearch(event.target.value)}
        />

        <Select
          style={{ width: 180 }}
          value={statusFilter}
          options={statusFilterOptions}
          onChange={setStatusFilter}
        />
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredOrders}
        pagination={{ pageSize: 8 }}
      />
    </Space>
  );
}