import { createSlice } from '@reduxjs/toolkit';
import { findwarehouse } from './warehouseApi';

const initialState = {
  data: [],
  status: 'idle',
  isError: false,
  isLoading: false,
  isSuccess: false,
  errorMessage: '',
  skip: 0,
  limit: 10,
  totalEntries: 0,
  currentPage: 0,
};

const warehouseSlice = createSlice({
  name: 'warehouse',
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
  extraReducers: (build) => {
    build.addCase(findwarehouse.pending, (state) => {
      state.isLoading = true;
      state.status = 'pending';
    });
    build.addCase(findwarehouse.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.totalEntries = action.payload?.totalEntries;
      state.isError = false;
      state.isSuccess = true;
      state.isLoading = false;
      state.status = 'succeeded';
    });
    build.addCase(findwarehouse.rejected, (state, _) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.status = 'failed';
    });
  },
});

export const { reset, setCurrentPage, setLimit, setSkip, setStatus } = warehouseSlice.actions;
export default warehouseSlice.reducer;
