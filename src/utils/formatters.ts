import { format, isValid, parseISO } from 'date-fns';
import type { Order, OrderItem } from '../types/order';

export function formatDate(isoDate: string): string {
  const date = parseISO(isoDate);

  if (!isValid(date)) {
    return 'Data inválida';
  }

  return format(date, "dd/MM/yyyy 'às' HH:mm");
}

export function calcOrderTotal(items: OrderItem[]): number {
  return items.reduce((total, item) => {
    return total + item.quantity * item.unitPrice;
  }, 0);
}

export function formatCurrency(value: number): string {
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  return formattedValue
    .replaceAll(String.fromCharCode(160), ' ')
    .replaceAll(String.fromCharCode(8239), ' ');
}

export function calcInstallmentValue(
  total: number,
  installments: number,
): number {
  if (installments <= 0) {
    return 0;
  }

  return Number((total / installments).toFixed(2));
}

export function isPaymentComplete(order: Order): boolean {
  const orderTotalInCents = Math.round(calcOrderTotal(order.items) * 100);

  const paymentTotalInCents = Math.round(
    order.payments.reduce((total, payment) => {
      return total + payment.amount;
    }, 0) * 100,
  );

  return orderTotalInCents === paymentTotalInCents;
}
