import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../authGuards/ProtectedRoute";
import PublicRoute from "../authGuards/PublicRoute";
import PageNotFound from "../components/common/PageNotFound";
import Login from "../pages/authentication/Login";
import Dashboard from "../pages/Dashboard";
import MainLayout from "../pages/MainLayout";
//settings
import CompanyTabList from "../pages/settings/company/CompanyTabList";
import InventoryTabList from "../pages/settings/inventory/InventoryTabList";
import StaffTabList from "../pages/settings/staff/StaffTabList";
import {
  Categories,
  CategoriesAddPage,
  CategoriesListPage,
  CompanyAddPage,
  CompanyPage,
  CompanyViewPage,
  InoutStockListPage,
  Inventory,
  InventoryAddPage,
  InventoryListPage,
  InwardAddPage,
  InwardListPage,
  MainLayoutLab,
  OutwardAddPage,
  OutwardListPage,
  Roles,
  SalesAddPage,
  SalesPage,
  SalesViewPage,
  ServiceMgtPage,
  ServiceMgtViewPage,
  UserAddPage,
  UserArchivePage,
  UserPage,
  UserViewPage,
  WarehouseAddPage,
  WarehouseArchivePage,
  WarehousePage,
  WarehouseViewPage,
  WarrantyPage,
  WarrantyViewPage,
  ContactInquiryPage,
} from "./element";

function Routerjs() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/signin"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected routes with MainLayout */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        {/* <Route
          element={
            <ProtectedRoute>
              <SettingLayout />
            </ProtectedRoute>
          }
        > */}
        <Route path="setting">
          <Route index element={<InventoryTabList />} />
          {/* <Route path="service" element={<Index />} /> */}
          <Route path="inventory" element={<InventoryTabList />} />
        </Route>

        <Route path="staff">
          <Route index element={<StaffTabList />} />
        </Route>
        <Route path="companySetting">
          <Route index element={<CompanyTabList />} />
        </Route>
        {/* </Route> */}
        <Route path="warehouse">
          <Route index element={<WarehousePage />} />
          <Route path="new" element={<WarehouseAddPage />} />
          <Route path="edit/:id" element={<WarehouseAddPage />} />
          <Route path="view/:id" element={<WarehouseViewPage />} />
          <Route path="archived" element={<WarehouseArchivePage />} />
        </Route>

        <Route path="contact-inquiry">
          <Route index element={<ContactInquiryPage />} />
        </Route>

        <Route path="categories">
          <Route index element={<Categories />} />
          <Route path="new" element={<CategoriesAddPage />} />
          <Route path="edit/:id" element={<CategoriesAddPage />} />
          <Route path="view/:id" element={<CategoriesListPage />} />
        </Route>
        <Route path="user">
          <Route index element={<UserPage />} />
          <Route path="new" element={<UserAddPage />} />
          <Route path="edit/:id" element={<UserAddPage />} />
          <Route path="view/:id" element={<UserViewPage />} />
          <Route path="archived" element={<UserArchivePage />} />
        </Route>
        <Route path="role">
          <Route index element={<Roles />} />
        </Route>
        <Route path="company">
          <Route index element={<CompanyPage />} />
          <Route path="new" element={<CompanyAddPage />} />
          <Route path="edit/:id" element={<CompanyAddPage />} />
          <Route path="view/:id" element={<CompanyViewPage />} />
        </Route>
        <Route path="salesOrder">
          <Route index element={<SalesPage />} />
          <Route path="new" element={<SalesAddPage />} />
          <Route path="edit/:id" element={<SalesAddPage />} />
          <Route path="view/:id" element={<SalesViewPage />} />
        </Route>
        <Route path="inventory">
          <Route index element={<Inventory />} />
          <Route path="new" element={<InventoryAddPage />} />
          <Route path="edit/:id" element={<InventoryAddPage />} />
          <Route path="view/:id" element={<InventoryListPage />} />
        </Route>
        <Route path="warrantyMgt">
          <Route index element={<WarrantyPage />} />
          <Route path="view/:id" element={<WarrantyViewPage />} />
        </Route>
        <Route path="serviceMgt">
          <Route index element={<ServiceMgtPage />} />
          <Route path="view/:id" element={<ServiceMgtViewPage />} />
        </Route>
        <Route path="inward-outward-request">
          <Route index element={<MainLayoutLab />} />
          <Route path="view/:id" element={<InoutStockListPage />} />

          {/* Inward */}
          <Route path="inward">
            <Route index element={<InwardListPage />} />
            <Route path="new" element={<InwardAddPage />} />
            <Route path="edit/:id" element={<InwardAddPage />} />
            <Route path="view/:id" element={<InwardListPage />} />
          </Route>
          {/* Outward */}
          <Route path="outward">
            <Route index element={<OutwardListPage />} />
            <Route path="new" element={<OutwardAddPage />} />
            <Route path="edit/:id" element={<OutwardAddPage />} />
            <Route path="view/:id" element={<OutwardListPage />} />
          </Route>
         
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default Routerjs;
