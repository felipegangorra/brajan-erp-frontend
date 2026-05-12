import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ordersMock } from '../../mocks/orders';
import type { Order } from '../../types/order';

interface OrdersState {
  items: Order[];
}

// Initializes the state with a list of mock orders.
const initialState: OrdersState = {
  items: ordersMock,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Registers a new order by adding it to the end of the list.
    addOrder: (state, action: PayloadAction<Order>) => {
      state.items.push(action.payload);
    },
    // Searches for an order by ID and updates its data.
    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.items.findIndex(
        (order) => order.id === action.payload.id,
      );

      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
});

export const { addOrder, updateOrder } = ordersSlice.actions;

export const ordersReducer = ordersSlice.reducer;