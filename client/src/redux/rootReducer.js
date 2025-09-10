import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/auth/authSlice";
import warehouseReducer from "./slices/warehouse/warehouseSlice";
import userReducer from "./slices/user/userSlice";
import rolesReducer from "./slices/roles/rolesSlice";
import categoriesReducer from "./slices/categories/categoriesSlice";
import serviceReducer from "./slices/service/serviceSlice";
import inventoryReducer from "./slices/inventory/inventorySlice";
import companyReducer from "./slices/company/companySlice";
import salesOrdersReducer from "./slices/salesOrder/salesOrderSlice";
import inwordReducer from "./slices/inward/inwardSlice";
import outwardReducer from "./slices/outward/outwardSlice";
import warrantyReducer from "./slices/warranty/warrantySlice";
import inquiryReducer from "./slices/contactInquiry/contactInquirySlice";

const rootReducer = combineReducers({
  auth: authReducer,
  warehouse: warehouseReducer,
  users: userReducer,
  roles: rolesReducer,
  categories: categoriesReducer,
  service: serviceReducer,
  inventory: inventoryReducer,
  company: companyReducer,
  salesOrders: salesOrdersReducer,
  inward: inwordReducer,
  outward: outwardReducer,
  warranty: warrantyReducer,
  inquiry:inquiryReducer,
});

const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

export { rootReducer as default, rootPersistConfig };
