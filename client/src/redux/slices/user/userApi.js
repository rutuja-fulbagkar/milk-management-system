import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { api } from "../../../utils/api";

export const finduser = createAsyncThunk(
  "user/finduser",
  async (values, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/users?limit=${values?.limit || 25}&page=${
          (values?.page ?? 0) + 1
        }&isArchived=${values?.isArchived || false}&search=${
          values?.search || ""
        }&role=${values?.role || ""}&status=${values?.status || ""}`
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const getuserbyId = createAsyncThunk(
  "user/getuser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/users/${id}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/users/user`, data);
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

export const deleteuserMultiple = createAsyncThunk(
  "user/deleteuserMultiple",
  async (queryParams, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/users/delete-many`, {
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

export const editUser = createAsyncThunk(
  "user/editUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/users/${data?.paramsId}`,
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

export const archiveUser = createAsyncThunk(
  "warehouse/archiveUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/users/archive/${id}`);
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

export const deleteUser = createAsyncThunk(
  "warehouse/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/users/${id}`);
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

export const findUserWithoutPagination = createAsyncThunk(
  "user/finduser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/users/all`);
      return response?.data?.data;
    } catch (error) {
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

//setting
export const staffsetting = createAsyncThunk(
  "user/staffsetting",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/setting/staff/create`, data);
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

export const getStaffSetting = createAsyncThunk(
  "user/getStaffSetting",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/setting/staff`);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
