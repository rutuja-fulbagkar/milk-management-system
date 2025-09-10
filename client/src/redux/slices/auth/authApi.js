import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { api } from '../../../utils/api';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      toast.success(response?.data?.message || 'Login successful!');
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed!');
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
