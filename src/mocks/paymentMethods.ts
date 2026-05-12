import type { PaymentMethod } from '../types/payment-method';

export const paymentMethodsMock: PaymentMethod[] = [
  {
    id: '2bc1d799-7296-4c1c-9c4f-d82e1801p101',
    name: 'Dinheiro',
    type: 'money',
    maxInstallments: 1,
    active: true,
  },
  {
    id: '44b5f4db-63db-41dd-991f-34877001p102',
    name: 'Cartão de Crédito',
    type: 'credit_card',
    maxInstallments: 12,
    active: true,
  },
  {
    id: '9bdf5b16-0d1f-46d5-8af7-d2730701p103',
    name: 'Cartão de Débito',
    type: 'debit_card',
    maxInstallments: 1,
    active: true,
  },
  {
    id: '9f69a86e-6260-4e77-88e7-cdc45501p104',
    name: 'Pix',
    type: 'pix',
    maxInstallments: 1,
    active: true,
  },
  {
    id: '8c7b9077-96af-4116-a037-b5957201p105',
    name: 'Boleto Bancário',
    type: 'boleto',
    maxInstallments: 1,
    active: false,
  },
];