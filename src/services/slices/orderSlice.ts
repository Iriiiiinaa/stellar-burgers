import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getOrderByNumberApi,
  orderBurgerApi
} from '../../utils/burger-api';

import type { TOrder } from '@utils-types';

type TOrderState = {
  orderData: TOrder | null;
  isLoading: boolean;
  error: string | null;

  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: TOrderState = {
  orderData: null,
  isLoading: false,
  error: null,

  orderRequest: false,
  orderModalData: null
};

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);

    return response.orders[0];
  }
);

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);

    return response.order;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
  clearOrder: (state) => {
    state.orderData = null;
  },

  clearOrderModal: (state) => {
    state.orderModalData = null;
  }
},

  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderData = action.payload;
      })

      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message ?? 'Не удалось получить заказ';
      })

      .addCase(createOrder.pending, (state) => {
  state.orderRequest = true;
  state.orderModalData = null;
  state.error = null;
})

.addCase(createOrder.fulfilled, (state, action) => {
  state.orderRequest = false;
  state.orderModalData = action.payload;
})

.addCase(createOrder.rejected, (state, action) => {
  state.orderRequest = false;
  state.error =
    action.error.message ?? 'Не удалось оформить заказ';
});
  }
});

export const {
  clearOrder,
  clearOrderModal
} = orderSlice.actions;

export default orderSlice.reducer;
