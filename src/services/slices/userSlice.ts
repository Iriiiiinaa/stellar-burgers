import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  updateUserApi,
  logoutApi
} from '../../utils/burger-api';

import type {
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';
import type { TUser } from '@utils-types';

import { setCookie } from '../../utils/cookie';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  loginRequest: boolean;
  loginError: string | null;
  registerRequest: boolean;
registerError: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  loginRequest: false,
  loginError: null,
  registerRequest: false,
  registerError: null
};

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async () => {
    const response = await getUserApi();
    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);

    localStorage.setItem(
      'refreshToken',
      response.refreshToken
    );

    setCookie(
      'accessToken',
      response.accessToken
    );

    return response.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    console.log('THUNK START', data);

    const response = await registerUserApi(data);

    console.log('REGISTER RESPONSE', response);

    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);

    return response.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async () => {
    await logoutApi();

    localStorage.removeItem('refreshToken');
    setCookie('accessToken', '', { expires: -1 });
  }
);

const userSlice = createSlice({
  name: 'user',

  initialState,

  reducers: {
  authCheckComplete: (state) => {
    state.isAuthChecked = true;
  }
},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })

      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })

      .addCase(loginUser.pending, (state) => {
        state.loginRequest = true;
        state.loginError = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginRequest = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loginRequest = false;
        state.loginError =
          action.error.message ?? 'Ошибка авторизации';
      })

      .addCase(registerUser.pending, (state) => {
       state.registerRequest = true;
       state.registerError = null;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
      state.registerRequest = false;
      state.user = action.payload;
      state.isAuthChecked = true;
       })

      .addCase(registerUser.rejected, (state, action) => {
       state.registerRequest = false;
       state.registerError =
       action.error.message ?? 'Ошибка регистрации';
       })

       .addCase(updateUser.fulfilled, (state, action) => {
       state.user = action.payload;
       })

       .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
       });
  }
});
export const { authCheckComplete } = userSlice.actions;
export default userSlice.reducer;