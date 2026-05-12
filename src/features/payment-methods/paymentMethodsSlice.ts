import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { paymentMethodsMock } from '../../mocks/paymentMethods';
import type { PaymentMethod } from '../../types/payment-method';

interface PaymentMethodsState {
  items: PaymentMethod[];
}

// Inicializa o estado com uma lista de dados simulados (mock).
const initialState: PaymentMethodsState = {
  items: paymentMethodsMock,
};

const paymentMethodsSlice = createSlice({
  name: 'paymentMethods',
  initialState,
  reducers: {
    // Adds a new payment method to the end of the list.
    addPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.items.push(action.payload);
    },
    // Searches for a payment method by ID and updates its data if it exists.
    updatePaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      const index = state.items.findIndex(
        (paymentMethod) => paymentMethod.id === action.payload.id,
      );

      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    // Deactivates a payment method (logical exclusion) by changing the active flag to false.
    deactivatePaymentMethod: (state, action: PayloadAction<string>) => {
      const paymentMethod = state.items.find(
        (item) => item.id === action.payload,
      );

      if (paymentMethod) {
        paymentMethod.active = false;
      }
    },
  },
});

export const {
  addPaymentMethod,
  updatePaymentMethod,
  deactivatePaymentMethod,
} = paymentMethodsSlice.actions;

export const paymentMethodsReducer = paymentMethodsSlice.reducer;