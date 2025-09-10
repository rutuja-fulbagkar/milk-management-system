import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { api } from "../../../utils/api";

export const findSite = createAsyncThunk(
  "site/findSite",
  async (values, { rejectWithValue }) => {
    try {
      const { page = 0, limit = 25, search = "", isArchived = false } = values;
      const response = await api.get(
        `/api/sites?limit=${limit}&page=${page + 1}&search=${search}&status=${isArchived}`
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const getsitebyId = createAsyncThunk(
  "site/getsite",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/sites/${id}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const findSiteWithoutPagination = createAsyncThunk(
  "sites/findSiteWithoutPagination",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/sites/all`);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
