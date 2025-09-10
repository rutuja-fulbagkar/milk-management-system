import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { api } from '../../../utils/api';

export const findwarehouse = createAsyncThunk(
  'warehouse/findwarehouse',
  async (values = {}, { rejectWithValue }) => {
    const params = {
      ...values,
    };
    try {
      const response = await api.get(
        `/api/warehouses?limit=${params.limit || 10}` +
        `&page=${(params.page ?? 0) + 1}` +
        `&isArchived=${params.isArchived || false}` +
        `&search=${params.search || " "}`
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Error fetching warehouses');
    }
  }
);

export const getwarehousebyId = createAsyncThunk(
  'warehouse/getwarehouse',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/warehouses/${id}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);


export const geteditUserbyId = createAsyncThunk(
  'user/geteditUserbyId',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/warehouse/${id}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);


export const geteditwarehousebyId = createAsyncThunk(
  'warehouse/getwarehouse',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/warehouses/${id}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
export const createwarehouse = createAsyncThunk(
  'warehouse/createwarehouse',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/warehouses/warehouse`, data);
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

export const editwarehouse = createAsyncThunk(
  'warehouse/editwarehouse',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/warehouses/${data?.paramsId}`, data?.data);
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

export const deactivatewarehouse = createAsyncThunk(
  'warehouse/deactivatewarehouse',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/warehouses/status/${id}`);
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

export const deletewarehouse = createAsyncThunk(
  'warehouse/deletewarehouse',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/warehouses/delete/${id}`);
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


export const findWarehouseWithoutPagination = createAsyncThunk(
  'warehouse/findwarehouse',
  async (values, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/warehouses/all`
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);



export const findUserWithoutPagination = createAsyncThunk(
  'warehouse/findwarehouse',
  async (values, { rejectWithValue }) => {
    const projectName = values?.projectName || '';
    try {

      const response = await api.get(
        `/api/users/all`
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const createWarehousebyImportExl = createAsyncThunk(
  'warehouses/createWarehousebyImportExl',
  async (values, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/warehouses/create-many', { excelData: values });
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


export const findAllComapny = createAsyncThunk(
  'warehouse/findwarehouse',
  async (values, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/companies/all`
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);


// http://192.168.2.12:5000/api/warehouses/68428507a9d5ad47a1895937
// http://192.168.2.12:5000/api/warehouses/archive/684273b714f8d167042a182c


//Archive
export const archiveManyWarehouse = createAsyncThunk(
  'warehouses/archiveManyWarehouse',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/warehouses/archive-many', data);
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

export const archivewarehousebyId = createAsyncThunk(
  'warehouse/getwarehouse',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/warehouses/${id}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const archivewarehousebyIdForSingle = createAsyncThunk(
  'warehouse/getwarehouse',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/warehouses/archive/${id}`);
      if (response.status === 200) {
        toast.success(response?.data?.message);
        return response?.data;
      }
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);