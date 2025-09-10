import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { api } from '../../../utils/api';

 

export const findInward = createAsyncThunk(
  'inward/findInward',
  async ({ limit, page, filters }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/stocks?limit=${limit || 10}&page=${(page ?? 0) + 1}&requestType=Inward&status=${filters?.status || ''}&search=${filters?.search || ''}&timeRange=${filters?.timeRange || ''}&startDate=${filters?.startDate || ''}&endDate=${filters?.endDate || ''}`
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
 

 
export const getInwardbyId = createAsyncThunk(
  'inward/getInward',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/stocks/${id}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
 
 

export const createInward = createAsyncThunk(
  'inward/createInward',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/stocks/inward`, data);
      if (response?.status === 200) {
        toast.success(response?.data?.message);
        return response?.data;
      }
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'An unexpected error occurred');
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const editInwardStatus = createAsyncThunk(
  'inward/editInward',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/stocks/${data?.paramsId}`, data?.data);
      if (response.status === 200) {
        toast.success(response?.data?.message);
        return response?.data;
      }
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'An unexpected error occurred');
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const deleteInward = createAsyncThunk(
  'inward/deleteInward',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/stocks/${id}`);
      if (response?.status === 200) {
        toast.success(response?.data?.message);
      }
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'An unexpected error occurred');
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
 