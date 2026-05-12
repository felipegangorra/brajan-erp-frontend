import { describe, expect, it } from 'vitest';
import type { Order, OrderItem } from '../types/order';
import {
  calcInstallmentValue,
  calcOrderTotal,
  formatCurrency,
  formatDate,
  isPaymentComplete,
} from '../utils/formatters';

describe('formatDate', () => {
  it('formats a valid ISO date', () => {
    expect(formatDate('2025-05-05T14:30:00')).toBe('05/05/2025 às 14:30');
  });

  it('returns "Data inválida" for invalid string', () => {
    expect(formatDate('abc')).toBe('Data inválida');
  });

  // Validates the correct rendering of midnight (00:00) times.
  it('formats midnight correctly', () => {
    expect(formatDate('2025-01-10T00:00:00')).toBe('10/01/2025 às 00:00');
  });
});

describe('calcOrderTotal', () => {
  // Calculates the total by adding the product of price x quantity of multiple items.
  it('calculates total from order items', () => {
    const items: OrderItem[] = [
      {
        productId: 'product-1',
        productName: 'Produto 1',
        unit: 'un',
        quantity: 2,
        unitPrice: 10,
      },
      {
        productId: 'product-2',
        productName: 'Produto 2',
        unit: 'kg',
        quantity: 3,
        unitPrice: 5.5,
      },
    ];

    expect(calcOrderTotal(items)).toBe(36.5);
  });

  it('returns 0 for empty items array', () => {
    expect(calcOrderTotal([])).toBe(0);
  });

  // Handles floating-point precision in prices with decimal places (using toBeCloseTo).
  it('handles decimal unit prices', () => {
    const items: OrderItem[] = [
      {
        productId: 'product-1',
        productName: 'Produto 1',
        unit: 'un',
        quantity: 3,
        unitPrice: 2.99,
      },
    ];

    expect(calcOrderTotal(items)).toBeCloseTo(8.97);
  });
});

describe('formatCurrency', () => {
  it('formats currency in BRL', () => {
    expect(formatCurrency(1250.5)).toBe('R$ 1.250,50');
  });

  it('formats zero currency value', () => {
    expect(formatCurrency(0)).toBe('R$ 0,00');
  });
});

describe('calcInstallmentValue', () => {
  // Performs the division into parts, setting the limit to two decimal places.
  it('calculates installment value with two decimal places', () => {
    expect(calcInstallmentValue(1000, 3)).toBe(333.33);
  });

  // Returns the full amount if the payment is made in full (1 installment).
  it('returns total when installments is 1', () => {
    expect(calcInstallmentValue(250, 1)).toBe(250);
  });

  it('returns 0 when installments is 0', () => {
    expect(calcInstallmentValue(100, 0)).toBe(0);
  });
});

describe('isPaymentComplete', () => {
  const baseOrder: Order = {
    id: 'order-1',
    customerName: 'Cliente Teste',
    status: 'approved',
    createdAt: '2025-05-05T14:30:00',
    items: [
      {
        productId: 'product-1',
        productName: 'Produto 1',
        unit: 'un',
        quantity: 2,
        unitPrice: 50,
      },
      {
        productId: 'product-2',
        productName: 'Produto 2',
        unit: 'un',
        quantity: 1,
        unitPrice: 25,
      },
    ], //Expected total: 125
    payments: [],
  };

  // Confirms payment when a single payment exactly equals the total amount.
  it('returns true when payment amount matches order total', () => {
    const order: Order = {
      ...baseOrder,
      payments: [
        {
          paymentMethodId: 'payment-1',
          paymentMethodName: 'Pix',
          installments: 1,
          amount: 125,
        },
      ],
    };

    expect(isPaymentComplete(order)).toBe(true);
  });

  // Confirms payment when the sum of different payments reaches the exact total.
  it('returns true when multiple payments match order total', () => {
    const order: Order = {
      ...baseOrder,
      payments: [
        {
          paymentMethodId: 'payment-1',
          paymentMethodName: 'Dinheiro',
          installments: 1,
          amount: 50,
        },
        {
          paymentMethodId: 'payment-2',
          paymentMethodName: 'Cartão de Crédito',
          installments: 2,
          amount: 75,
        },
      ],
    };

    expect(isPaymentComplete(order)).toBe(true);
  });

  // Rejects payment when the amount paid is less than the total.
  it('returns false when payment amount is lower than order total', () => {
    const order: Order = {
      ...baseOrder,
      payments: [
        {
          paymentMethodId: 'payment-1',
          paymentMethodName: 'Pix',
          installments: 1,
          amount: 100,
        },
      ],
    };

    expect(isPaymentComplete(order)).toBe(false);
  });

  // Rejects payment when an overpayment is made (greater than the total amount requested).
  it('returns false when payment amount is higher than order total', () => {
    const order: Order = {
      ...baseOrder,
      payments: [
        {
          paymentMethodId: 'payment-1',
          paymentMethodName: 'Pix',
          installments: 1,
          amount: 130,
        },
      ],
    };

    expect(isPaymentComplete(order)).toBe(false);
  });
});