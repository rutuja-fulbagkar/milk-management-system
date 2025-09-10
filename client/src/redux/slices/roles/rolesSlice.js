import { React } from 'react';
import { createSlice } from '@reduxjs/toolkit';
import { findRoles } from './rolesApi';

const initialState = {
  data: [],
  status: 'idle',
  isError: false,
  isLoading: false,
  isSuccess: false,
  errorMessage: '',
  skip: 0,
  limit: 10,
  totalRecords: 0,
  currentPage: 0,
};

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    setLimit: (state, action) => {
      state.limit = action.payload.limit;
      state.status = 'idle';
    },
    setSkip: (state, action) => {
      state.skip = action.payload.skip;
      state.status = 'idle';
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload.currentPage;
    },
    setStatus: (state, action) => {
      state.status = action.payload.status;
    },
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(findRoles.pending, (state) => {
      state.isLoading = true;
      state.status = 'pending';
    });
    builder.addCase(findRoles.fulfilled, (state, action) => {
      state.data = action.payload?.data;
      state.totalRecords = action?.payload?.totalEntries || 0;
      state.isError = false;
      state.isSuccess = true;
      state.isLoading = false;
      state.status = 'succeeded';
    });
    builder.addCase(findRoles.rejected, (state, _) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.status = 'failed';
    });
  },
});

export const { reset, setCurrentPage, setLimit, setSkip, setStatus } =
  rolesSlice.actions;
export default rolesSlice.reducer;
