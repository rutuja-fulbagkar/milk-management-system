import { createSlice } from '@reduxjs/toolkit';
import { findInward } from './inwardApi';

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
  allItemsCount:0,
  rejectedRequest:0,
  pendingRequest:0,
  approvedRequest:0,
};

const inwardSlice = createSlice({
  name: 'inward',
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
    build.addCase(findInward.pending, (state) => {
      state.isLoading = true;
      state.status = 'pending';
    });
    build.addCase(findInward.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.totalEntries = action.payload?.totalEntries;
      state.rejectedRequest= action.payload?.rejectedRequest;
      state.pendingRequest=action.payload?.pendingRequest;
      state.approvedRequest=action.payload?.approvedRequest;
      state.allItemsCount = action.payload?.allItemsCount;
      state.isError = false;
      state.isSuccess = true;
      state.isLoading = false;
      state.status = 'succeeded';
    });
    build.addCase(findInward.rejected, (state, _) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.status = 'failed';
    });
  },
});

export const { reset, setCurrentPage, setLimit, setSkip, setStatus } = inwardSlice.actions;
export default inwardSlice.reducer;
