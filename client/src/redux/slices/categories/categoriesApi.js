import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { api } from '../../../utils/api';

export const findcategories = createAsyncThunk(
  'categories/findcategories',
  async (values, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/categories?limit=${
          values?.limit || 10
        }&page=${(values?.page ?? 0) + 1}&search=${values?.search || " "}`
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);


export const getcategoriesbyId = createAsyncThunk(
  'categories/getcategories',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/categories/${id}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);


export const createcategories = createAsyncThunk(
  'categories/createcategories',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/categories/category`, data);
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

export const editcategories = createAsyncThunk(
  'categories/editcategories',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/categories/${data?.id}`, data?.data);
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

export const deletecategories = createAsyncThunk(
  'categories/deletecategories',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/categories/${id}`);
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


export const findSitesWithoutPagination = createAsyncThunk(
  "sites/findSiteWithoutPagination",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/sites/all`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const findcategoriesWithoutPagination = createAsyncThunk(
  'categories/findcategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/categories/all`
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
 
 
 