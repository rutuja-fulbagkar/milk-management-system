import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { api } from "../../../utils/api";

export const findsalesOrders = createAsyncThunk(
  "salesOrders/findsalesOrders",
  async (values, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/sales-orders?limit=${values?.limit || 25}&page=${
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

export const getsalesOrdersbyId = createAsyncThunk(
  "salesOrders/getsalesOrders",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/sales-orders/${id}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const createSalesOrders = createAsyncThunk(
  "salesOrders/createSalesOrders",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/sales-orders/order`, data);
      if (response?.status === 201) {
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

export const deletesalesOrdersMultiple = createAsyncThunk(
  "salesOrders/deletesalesOrdersMultiple",
  async (queryParams, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/salesOrderss/delete-many`, {
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

export const editSalesOrders = createAsyncThunk(
  "salesOrders/editSalesOrders",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/sales-orders/${data?.paramsId}`,
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

export const setDateServices = createAsyncThunk(
  "salesOrders/setDateServices",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/services/date/${data?.paramsId}`,
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

export const findSalesOrdersWithoutPagination = createAsyncThunk(
  "salesOrders/findsalesOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/salesOrderss/all`);
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

