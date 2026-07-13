import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../api/client';
import type { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      return await authApi.login(data);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Ошибка входа';
      return rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (
    data: { email: string; password: string; name: string; role: UserRole },
    { rejectWithValue }
  ) => {
    try {
      return await authApi.register(data);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Ошибка регистрации';
      return rejectWithValue(message);
    }
  }
);

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    return await authApi.me();
  } catch {
    return rejectWithValue('Сессия истекла');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
