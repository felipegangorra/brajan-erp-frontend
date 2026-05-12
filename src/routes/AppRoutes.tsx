import { Navigate, Route, Routes } from 'react-router-dom';
import { OrderFormPage } from '../features/orders/OrderFormPage';
import { OrdersPage } from '../features/orders/OrdersPage';
import { PaymentMethodFormPage } from '../features/payment-methods/PaymentMethodFormPage';
import { PaymentMethodsPage } from '../features/payment-methods/PaymentMethodsPage';
import { ProductFormPage } from '../features/products/ProductFormPage';
import { ProductsPage } from '../features/products/ProductsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/orders" replace />} />

      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/new" element={<ProductFormPage />} />

      <Route path="/payment-methods" element={<PaymentMethodsPage />} />
      <Route path="/payment-methods/new" element={<PaymentMethodFormPage />} />

      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/orders/new" element={<OrderFormPage />} />

      <Route path="*" element={<Navigate to="/orders" replace />} />
    </Routes>
  );
}