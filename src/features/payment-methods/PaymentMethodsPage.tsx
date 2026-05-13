import { Button, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import type {
  PaymentMethod,
  PaymentMethodType,
} from '../../types/payment-method';
import { deactivatePaymentMethod } from './paymentMethodsSlice';

const paymentTypeLabels: Record<PaymentMethodType, string> = {
  money: 'Dinheiro',
  credit_card: 'Cartão de crédito',
  debit_card: 'Cartão de débito',
  pix: 'Pix',
  boleto: 'Boleto',
};

export function PaymentMethodsPage() {
  const dispatch = useAppDispatch();
  const paymentMethods = useAppSelector((state) => state.paymentMethods.items);

  const columns: ColumnsType<PaymentMethod> = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      render: (type: PaymentMethodType) => paymentTypeLabels[type],
    },
    {
      title: 'Máx. parcelas',
      dataIndex: 'maxInstallments',
      key: 'maxInstallments',
      width: 140,
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
      render: (_, paymentMethod) => (
        <Space>
          <Button size="small" disabled>
            Editar
          </Button>

          <Popconfirm
            title="Inativar forma de pagamento"
            description="Deseja inativar esta forma de pagamento?"
            okText="Sim"
            cancelText="Não"
            disabled={!paymentMethod.active}
            onConfirm={() =>
              dispatch(deactivatePaymentMethod(paymentMethod.id))
            }
          >
            <Button size="small" danger disabled={!paymentMethod.active}>
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
            Formas de pagamento
          </Typography.Title>
          <Typography.Text type="secondary">
            Cadastro e controle das formas de pagamento disponíveis nos pedidos.
          </Typography.Text>
        </div>

        <Link to="/payment-methods/new">
          <Button type="primary">Nova forma de pagamento</Button>
        </Link>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={paymentMethods}
        pagination={{ pageSize: 8 }}
      />
    </Space>
  );
}