import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { productsMock } from '../../mocks/products';
import type { Product } from '../../types/product';

interface ProductsState {
  items: Product[];
}

// Initializes the state with a list of mock data.
const initialState: ProductsState = {
  items: productsMock,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Adds a new product to the end of the list.
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
    },
    // Searches for a product by ID and replaces its data if it already exists.
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(
        (product) => product.id === action.payload.id,
      );

      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    // Deactivates a product
    deactivateProduct: (state, action: PayloadAction<string>) => {
      const product = state.items.find((item) => item.id === action.payload);

      if (product) {
        product.active = false;
      }
    },
  },
});

export const { addProduct, updateProduct, deactivateProduct } =
  productsSlice.actions;

export const productsReducer = productsSlice.reducer;