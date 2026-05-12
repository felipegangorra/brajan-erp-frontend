export type OrderStatus = 'pending' | 'approved' | 'shipped' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderPayment {
  paymentMethodId: string;
  paymentMethodName: string;
  installments: number;
  amount: number;
}

export interface Order {
  id: string;
  customerName: string;
  status: OrderStatus;
  items: OrderItem[];
  payments: OrderPayment[];
  createdAt: string;
}