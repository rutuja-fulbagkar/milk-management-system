import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { api } from "../../../utils/api";

export const findCompany = createAsyncThunk(
  "company/findcompany",
  async (values, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/companies?limit=${values?.limit || 25}&page=${
          (values?.page ?? 0) + 1
        }&isArchived=${values?.isArchived || false}&search=${
          values?.search || ""
        }&timeRange=${values?.timeRange || ""}&status=${
          values?.status || ""
        }&startDate=${values?.startDate ? values?.startDate : ""}&endDate=${
          values?.endDate ? values?.endDate : ""
        }`
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const getCompanybyId = createAsyncThunk(
  "company/getCompanybyId",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/companies/${id}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const createCompany = createAsyncThunk(
  "company/createCompany",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/companies/company`, data);
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

export const deletecompanyMultiple = createAsyncThunk(
  "company/deletecompanyMultiple",
  async (queryParams, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/companys/delete-many`, {
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

export const editCompany = createAsyncThunk(
  "company/editCompany",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/companies/${data?.paramsId}`,
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

export const findCompanyithoutPagination = createAsyncThunk(
  "company/findcompany",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/companies/all`);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const deleteCompany = createAsyncThunk(
  "company/deleteCompany",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`//${id}`);
      if (response?.status === 200) {
        toast.success(response?.data?.message);
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

export const findCompanyWithoutPagination = createAsyncThunk(
  "company/findCompanyWithoutPagination",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/companies`);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const fetchPartsHistory = createAsyncThunk(
  "company/fetchPartsHistory",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/stocks/history/${id}?status=${status}`);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch parts history");
    }
  }
);


//setting
export const companysetting = createAsyncThunk(
  'company/companysetting',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/setting/company/create`, data);
      if (response?.status === 200) {
        toast.success(response?.data?.message);
        return response?.data;
      }
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const getCompanySetting = createAsyncThunk(
  'company/getCompanySetting',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/setting/company`);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const sitesetting = createAsyncThunk(
  'company/sitesetting',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/setting/site/create`, data);
      if (response?.status === 200) {
        toast.success(response?.data?.message);
        return response?.data;
      }
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const getSiteSetting = createAsyncThunk(
  'company/getSiteSetting',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/setting/site`);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
