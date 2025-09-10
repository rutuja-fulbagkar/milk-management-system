import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { api } from "../../../utils/api";

export const findservices = createAsyncThunk(
  "services/findservices",
  async (values, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/services?limit=${values?.limit || 25}&page=${
          (values?.page ?? 0) + 1
        }&companyId=${values?.status || ""}&userId=${values?.role || ""}&search=${
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

export const getServiceViewbyId = createAsyncThunk(
  "services/getservices",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/services/${id}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const createservices = createAsyncThunk(
  "services/createservices",
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

export const createUserbyexcel = createAsyncThunk(
  "user/createUserbyexcel",
  async (values, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/users/create-many", {
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

export const createUpdateService = createAsyncThunk(
  "services/createservices",
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/setting/service/${id}`, data);
      if (response?.status === 200) {
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

export const findService = createAsyncThunk(
  "services/findservices",
  async (values, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/setting/service`
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
export const deleteservicesMultiple = createAsyncThunk(
  "services/deleteservicesMultiple",
  async (queryParams, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/servicess/delete-many`, {
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

export const editservices = createAsyncThunk(
  "services/editservices",
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

export const findservicesWithoutPagination = createAsyncThunk(
  "services/findservices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/servicess/all`);
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
