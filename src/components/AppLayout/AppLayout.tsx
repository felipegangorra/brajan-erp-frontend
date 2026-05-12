import {
  CreditCardOutlined,
  ShoppingCartOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const menuItems: MenuProps['items'] = [
  {
    key: '/orders',
    icon: <ShoppingCartOutlined />,
    label: <Link to="/orders">Pedidos</Link>,
  },
  {
    key: '/products',
    icon: <TagsOutlined />,
    label: <Link to="/products">Produtos</Link>,
  },
  {
    key: '/payment-methods',
    icon: <CreditCardOutlined />,
    label: <Link to="/payment-methods">Formas de pagamento</Link>,
  },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const selectedKeys = useMemo(() => {
    if (location.pathname.startsWith('/products')) {
      return ['/products'];
    }

    if (location.pathname.startsWith('/payment-methods')) {
      return ['/payment-methods'];
    }

    return ['/orders'];
  }, [location.pathname]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ padding: 16 }}>
          <Typography.Text style={{ color: '#fff', fontWeight: 700 }}>
            Brajan ERP
          </Typography.Text>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Typography.Text strong>Módulo de Gestão Comercial</Typography.Text>
        </Header>

        <Content style={{ margin: 24 }}>
          <div
            style={{
              background: '#fff',
              borderRadius: 8,
              minHeight: 360,
              padding: 24,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}