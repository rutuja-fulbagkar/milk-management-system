import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../../utils/api';

 

export const findInquiry = createAsyncThunk(
  'inward/findInquiry',
  async ({ limit, page, filters }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/contact-us?limit=${limit || 10}&page=${(page ?? 0) + 1}&search=${filters?.search || ''}&startDate=${filters?.startDate || ''}&endDate=${filters?.endDate || ''}`
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
  