import { configureStore } from '@reduxjs/toolkit';
import { ordersReducer } from '../features/orders/ordersSlice';
import { paymentMethodsReducer } from '../features/payment-methods/paymentMethodsSlice';
import { productsReducer } from '../features/products/productsSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    paymentMethods: paymentMethodsReducer,
    orders: ordersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;