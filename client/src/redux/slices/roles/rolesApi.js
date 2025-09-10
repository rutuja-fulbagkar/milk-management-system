import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { api } from "../../../utils/api";

export const findRoles = createAsyncThunk(
  "roles/fetchRoles",
  async (values, { rejectWithValue }) => {
    const page = (values?.page ?? 0) + 1 || 1;
    try {
      const response = await api.get(
        `/api/roles?search=${values?.search || ""}&limit=${
          values?.limit || 25
        }&page=${page}`
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const getRoles = createAsyncThunk(
  "roles/getRoles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/roles");
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const createRole = createAsyncThunk(
  "roles/createRole",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/roles/role", data);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async ({ id, name, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/roles/${id}`, { name, status });
      toast.success("Role updated successfully");
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const deleteRole = createAsyncThunk(
  "roles/deleteRole",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/roles/${id}`);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const findRolesWithoutPagination = createAsyncThunk(
  "roles/findRoles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/roles`);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
