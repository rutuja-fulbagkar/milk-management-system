import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { api } from '../../../utils/api';

export const findInventory = createAsyncThunk(
  'inventory/findInventory',
  async (values, { rejectWithValue }) => {
    try {
      const { limit = 10, page = 0, filters = {} } = values;

      const params = new URLSearchParams();
      params.append('limit', limit);
      params.append('page', page + 1);

      if (filters.stockStatus && filters.stockStatus !== 'all') {
        params.append('status', filters.stockStatus);
      }

      if (filters.searchTerm && filters.searchTerm.trim() !== '') {
        params.append('search', filters.searchTerm.trim());
      }

      const response = await api.get(`/api/inventories?${params.toString()}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Something went wrong');
    }
  }
);

export const findAllInventory = createAsyncThunk(
  'inventory/findInventory',
  async (values, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/inventories/all`
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);


export const getInventorybyId = createAsyncThunk(
  'inventory/getInventory',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/inventories/${id}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }


  }
);



export const getInventoryhistorybyId = createAsyncThunk(
  'inventory/getInventory',
  async (values, { rejectWithValue }) => {
    try {
      const { limit = 10, page = 0, paramId, filters = {} } = values;

      const params = new URLSearchParams();
      params.append('limit', limit);
      params.append('page', page + 1);

      if (filters.startDate && filters.startDate !== 'all') {
        params.append('startDate', filters.startDate);
      }
      if (filters.endDate && filters.endDate !== 'all') {
        params.append('endDate', filters.endDate);
      }
      if (filters.search && filters.search.trim() !== '') {
        params.append('search', filters.search.trim());
      }

      const response = await api.get(`/api/inventories/history/${paramId.toString()}?${params.toString()}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Something went wrong');
    }
  }
);

//setting
export const inventorysetting = createAsyncThunk(
  'inventory/getInventory',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/setting/inventory/create`, data);
      if (response?.status === 200) {
        toast.success(response?.data?.message);
        return response?.data;
      }
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const getInventorySetting = createAsyncThunk(
  'inventory/getInventory',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/setting/inventory`);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);


export const createInventory = createAsyncThunk(
  'inventory/createInventory',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/inventories/inventory`, data);
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

export const editInventory = createAsyncThunk(
  'inventory/editInventory',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/inventories/${data?.id}`, data?.data);
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

export const deleteInventory = createAsyncThunk(
  'inventory/deleteInventory',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/inventories/${id}`);
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


export const createInventorybyImportExl = createAsyncThunk(
  'inventories/createInventorybyImportExl',
  async (values, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/inventories/create-many', { excelData: values });
      if (response.status === 200) {
        toast.success(response?.data?.message);
        return response?.data;
      }
      return response?.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.response.data.message);
    }
  }
);

