import { createSlice } from "@reduxjs/toolkit";
import { findCompany, fetchPartsHistory } from "./companyApi";

const initialState = {
  data: [],
  installationData: [],
  warrantyData: [],
  loading: false,
  amcData: [],
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

const companySlice = createSlice({
  name: "company",
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
    build.addCase(findCompany.pending, (state) => {
      state.isLoading = true;
      state.status = "pending";
    });
    build.addCase(findCompany.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.totalRecords = action.payload.totalEntries;
      state.isError = false;
      state.isSuccess = true;
      state.isLoading = false;
      state.status = "succeeded";
    });
    build.addCase(findCompany.rejected, (state, _) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.status = "failed";
    });
    build
      .addCase(fetchPartsHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPartsHistory.fulfilled, (state, action) => {
        if (action.meta.arg.status === "Installation") {
          state.installationData = action.payload;
        } else if (action.meta.arg.status === "Warranty") {
          state.warrantyData = action.payload;
        } else if (action.meta.arg.status === "AMC") {
          state.amcData = action.payload;
        }
        state.loading = false;
      })
      .addCase(fetchPartsHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { reset, setCurrentPage, setLimit, setSkip, setStatus } =
  companySlice.actions;
export default companySlice.reducer;
