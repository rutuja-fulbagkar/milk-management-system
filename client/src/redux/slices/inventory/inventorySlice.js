import { createSlice } from '@reduxjs/toolkit';
import { findInventory, getInventoryhistorybyId } from './inventoryApi';

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
  outOfStockCount: 0,
  allItemsCount: 0,
  inStockCount: 0,
  lowStockCount: 0,
  totalRecord: 0,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setLimit: (state, action) => {
      state.limit = action.payload.limit;
      state.status = 'idle';
    },
    setSkip: (state, action) => {
      state.skip = action.payload;
      state.status = 'idle';
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload.currentPage;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    reset: () => ({ ...initialState }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(findInventory.pending, (state) => {
        state.isLoading = true;
        state.status = 'pending';
      })
      .addCase(findInventory.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.totalEntries = action.payload.totalEntries;
        state.outOfStockCount = action.payload.outOfStockCount;
        state.allItemsCount = action.payload.allItemsCount;
        state.inStockCount = action.payload.inStockCount;
        state.lowStockCount = action.payload.lowStockCount;
        state.isError = false;
        state.isSuccess = true;
        state.isLoading = false;
        state.status = 'succeeded';
      })
      .addCase(findInventory.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.status = 'failed';
      })
      .addCase(getInventoryhistorybyId.pending, (state) => {
        state.isLoading = true;
        state.status = 'pending';
      })
      .addCase(getInventoryhistorybyId.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.totalRecord = action.payload.data?.pagination?.totalEntries || 0;
        state.isError = false;
        state.isSuccess = true;
        state.isLoading = false;
        state.status = 'succeeded';
      })
      .addCase(getInventoryhistorybyId.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.status = 'failed';
      });
  },
});

export const { reset, setCurrentPage, setLimit, setSkip, setStatus } = inventorySlice.actions;
export default inventorySlice.reducer;
