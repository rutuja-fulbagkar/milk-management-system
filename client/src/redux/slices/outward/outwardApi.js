import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { api } from '../../../utils/api';
 
export const findOutward = createAsyncThunk(
  'outward/findOutward',
  async (values, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/stocks?limit=${values?.limit || 10}&page=${(values?.page ?? 0) + 1}&requestType=Outward&status=${values?.filters
          ?.status || ''}&search=${values?.filters?.search || ''}&timeRange=${values?.filters?.timeRange || ''}&startDate=${values?.filters?.startDate || ''}&endDate=${values?.filters?.endDate || ''}`
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);


export const getOutwardbyId = createAsyncThunk(
  'outward/getOutward',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/stocks/${id}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);



export const createOutward = createAsyncThunk(
  'outward/createOutward',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/stocks/outward`, data);
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

export const editOutwardStatus = createAsyncThunk(
  'outward/editOutward',
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

export const deleteOutward = createAsyncThunk(
  'outward/deleteOutward',
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

