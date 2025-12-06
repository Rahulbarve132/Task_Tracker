import { createSlice } from '@reduxjs/toolkit';
import api from '@/lib/axios';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      state.user = null;
      state.token = null;
      api.post('/api/auth/logout').catch(() => {});
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const { setUser, setLoading, setError, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
