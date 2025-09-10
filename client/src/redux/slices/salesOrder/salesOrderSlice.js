import { createSlice } from "@reduxjs/toolkit";
import { findsalesOrders } from "./salesOrderApi";

const initialState = {
  data: [],
  status: "idle",
  isError: false,
  isLoading: false,
  isSuccess: false,
  errorMessage: "",
  skip: 0,
  limit: 10,
  totalRecords: 0,
  currentPage: 0,
};

const salesOrderSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    setLimit: (state, action) => {
      state.limit = action.payload.limit;
      state.status = "idle";
    },
    setSkip: (state, action) => {
      state.skip = action.payload.skip;
      state.status = "idle";
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
    build.addCase(findsalesOrders.pending, (state) => {
      state.isLoading = true;
      state.status = "pending";
    });
    build.addCase(findsalesOrders.fulfilled, (state, action) => {
      state.data = action.payload;
      state.totalRecords = action.payload.totalEntries;
      state.isError = false;
      state.isSuccess = true;
      state.isLoading = false;
      state.status = "succeeded";
    });
    build.addCase(findsalesOrders.rejected, (state, _) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.status = "failed";
    });
  },
});

export const { reset, setCurrentPage, setLimit, setSkip, setStatus } =
  salesOrderSlice.actions;
export default salesOrderSlice.reducer;
