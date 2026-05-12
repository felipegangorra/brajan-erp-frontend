import type { Order } from '../types/order';

export const ordersMock: Order[] = [
  {
    id: 'f3c3f4ef-4696-4c37-a726-8126e7f1o101',
    customerName: 'Mercado Santa Rita',
    status: 'approved',
    createdAt: '2025-05-05T14:30:00',
    items: [
      {
        productId: '5d3e7f7a-7d88-4d44-90f2-27e4fd31c101',
        productName: 'Arroz Branco 5kg',
        unit: 'un',
        quantity: 10,
        unitPrice: 27.9,
      },
      {
        productId: 'a3a79315-66a6-4e37-93e2-86deac39c102',
        productName: 'Feijão Carioca 1kg',
        unit: 'un',
        quantity: 10,
        unitPrice: 8.49,
      },
    ],
    payments: [
      {
        paymentMethodId: '9f69a86e-6260-4e77-88e7-cdc45501p104',
        paymentMethodName: 'Pix',
        installments: 1,
        amount: 363.9,
      },
    ],
  },
  {
    id: 'c1cb6cdb-f678-44be-93cb-c5d762d1o102',
    customerName: 'Padaria Pão Dourado',
    status: 'pending',
    createdAt: '2025-05-06T10:15:00',
    items: [
      {
        productId: '42df7f62-24d2-4787-b57d-95d8a982c104',
        productName: 'Café Tradicional 500g',
        unit: 'un',
        quantity: 8,
        unitPrice: 16.9,
      },
      {
        productId: 'f927af68-2e8f-45de-a343-f047c613c103',
        productName: 'Açúcar Cristal 1kg',
        unit: 'un',
        quantity: 12,
        unitPrice: 4.39,
      },
    ],
    payments: [
      {
        paymentMethodId: '44b5f4db-63db-41dd-991f-34877001p102',
        paymentMethodName: 'Cartão de Crédito',
        installments: 3,
        amount: 188.88,
      },
    ],
  },
  {
    id: 'fcf12978-79dc-49ed-b17d-8cb32a31o103',
    customerName: 'Supermercado Central',
    status: 'shipped',
    createdAt: '2025-05-07T08:45:00',
    items: [
      {
        productId: '87cb67f4-61af-45a0-a73d-7bb44eb9c105',
        productName: 'Leite Integral 1L',
        unit: 'un',
        quantity: 50,
        unitPrice: 5.29,
      },
      {
        productId: '9f47f4cb-9878-4b6f-a1f8-df3f9d31c107',
        productName: 'Caixa de Ovos',
        unit: 'cx',
        quantity: 5,
        unitPrice: 24.9,
      },
    ],
    payments: [
      {
        paymentMethodId: '2bc1d799-7296-4c1c-9c4f-d82e1801p101',
        paymentMethodName: 'Dinheiro',
        installments: 1,
        amount: 120,
      },
      {
        paymentMethodId: '9f69a86e-6260-4e77-88e7-cdc45501p104',
        paymentMethodName: 'Pix',
        installments: 1,
        amount: 389,
      },
    ],
  },
  {
    id: '85eb28cf-b38d-4fa0-b459-10e05f81o104',
    customerName: 'Hortifruti Boa Safra',
    status: 'cancelled',
    createdAt: '2025-05-08T16:10:00',
    items: [
      {
        productId: 'c4f67436-bf0d-4c58-a2c6-f9fc1c72c106',
        productName: 'Banana Prata',
        unit: 'kg',
        quantity: 20,
        unitPrice: 6.99,
      },
    ],
    payments: [
      {
        paymentMethodId: '9bdf5b16-0d1f-46d5-8af7-d2730701p103',
        paymentMethodName: 'Cartão de Débito',
        installments: 1,
        amount: 139.8,
      },
    ],
  },
  {
    id: '63f4649f-9efe-4926-9732-1d978621o105',
    customerName: 'Mini Mercado São Jorge',
    status: 'approved',
    createdAt: '2025-05-09T11:25:00',
    items: [
      {
        productId: '5d3e7f7a-7d88-4d44-90f2-27e4fd31c101',
        productName: 'Arroz Branco 5kg',
        unit: 'un',
        quantity: 4,
        unitPrice: 27.9,
      },
      {
        productId: '87cb67f4-61af-45a0-a73d-7bb44eb9c105',
        productName: 'Leite Integral 1L',
        unit: 'un',
        quantity: 10,
        unitPrice: 5.29,
      },
      {
        productId: 'f927af68-2e8f-45de-a343-f047c613c103',
        productName: 'Açúcar Cristal 1kg',
        unit: 'un',
        quantity: 6,
        unitPrice: 4.39,
      },
    ],
    payments: [
      {
        paymentMethodId: '44b5f4db-63db-41dd-991f-34877001p102',
        paymentMethodName: 'Cartão de Crédito',
        installments: 2,
        amount: 191.94,
      },
    ],
  },
];