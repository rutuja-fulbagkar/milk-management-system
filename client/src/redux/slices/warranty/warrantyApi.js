import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { api } from "../../../utils/api";

export const findwarranty = createAsyncThunk(
  "warranty/findwarranty",
  async (values, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/services/warranty?limit=${values?.limit || 25}&page=${
          (values?.page ?? 0) + 1
        }&status=${values?.status || ""}&search=${
          values?.search || ""
        }&timeRange=${values?.timeRange || ""}&startDate=${
          values?.startDate ? values?.startDate : ""
        }&endDate=${values?.endDate ? values?.endDate : ""}`
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const getwarrantybyId = createAsyncThunk(
  "warranty/getwarranty",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/services/warranty/${id}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const deletewarrantyMultiple = createAsyncThunk(
  "warranty/deletewarrantyMultiple",
  async (queryParams, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/warrantys/delete-many`, {
        ids: queryParams,
      });
      if (response?.success) {
        toast.success(response?.data?.message);
      }
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const editWarranty = createAsyncThunk(
  "warranty/editWarranty",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/services/staff/${data?.paramsId}`,
        data?.data
      );
      if (response.status === 200) {
        toast.success(response?.data?.message);
        return response?.data;
      }
      return response?.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);


export const editMultipleAssignWarranty = createAsyncThunk(
  "warranty/editMultipleAssignWarranty",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/api/services/staff-many`,
        data?.data
      );
      if (response.status === 200) {
        toast.success(response?.data?.message);
        return response?.data;
      }
      return response?.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const editCompleteWarranty = createAsyncThunk(
  "warranty/editWarranty",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/services/${payload?.paramsId}`,
        payload?.data
      );
      if (response.status === 200) {
        toast.success(response?.data?.message);
        return response?.data;
      }
      return response?.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const getWarraty = createAsyncThunk(
  "warranty/getWarraty",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/services/warranty`);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const createSalesOrderbyexcel = createAsyncThunk(
  "service/createServicebyexcel",
  async (values, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/sales-orders/order", {
        excelData: values,
      });
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
