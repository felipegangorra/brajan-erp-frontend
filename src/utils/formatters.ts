import { format, isValid, parseISO } from 'date-fns';
import type { Order, OrderItem } from '../types/order';

export function formatDate(isoDate: string): string {
  const date = parseISO(isoDate);

  //It easily covers the case of an invalid date.
  if (!isValid(date)) {
    return 'Data inválida';
  }

  return format(date, "dd/MM/yyyy 'às' HH:mm");
}

//Method for calculating the total cost of an order.
export function calcOrderTotal(items: OrderItem[]): number {
  return items.reduce((total, item) => {
    return total + item.quantity * item.unitPrice;
  }, 0);
}

//Method for formatting in real currency
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
    .format(value)
    .replace(/\s/g, ' ');
}

//Method for determining the value of an installment.
export function calcInstallmentValue(total: number, installments: number): number {
  if (installments <= 0) {
    return 0;
  }

  return Number((total / installments).toFixed(2));
}

//Method for verifying order settlement
/*
It converts the values ​​to cents (by multiplying by 100) and uses Math.round before the comparison to work around classic floating-point imprecision flaws.
*/
export function isPaymentComplete(order: Order): boolean {
  const orderTotalInCents = Math.round(calcOrderTotal(order.items) * 100);

  const paymentTotalInCents = Math.round(
    order.payments.reduce((total, payment) => {
      return total + payment.amount;
    }, 0) * 100,
  );

  return orderTotalInCents === paymentTotalInCents;
}