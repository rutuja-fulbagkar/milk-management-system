import { Suspense, lazy } from 'react';
import Loader from '../components/Loader';

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );

// // AUTH
// export const LoginPage = Loadable(lazy(() => import('./pages/authentication/Login')));
// export const RegisterPage = Loadable(lazy(() => import('./pages/authentication/Register')));

// DASHBOARD
// export const DashboardPage = Loadable(lazy(() => import('./pages/Dashboard')));
export const WarehousePage = Loadable(lazy(() => import('../pages/warehouse/Warehouse')));
export const WarehouseArchivePage = Loadable(lazy(() => import('../pages/warehouse/archive/WarehouseArchive')));
export const WarehouseAddPage = Loadable(lazy(() => import('../pages/warehouse/create/Index')));
export const WarehouseViewPage = Loadable(lazy(() => import('../pages/warehouse/view/Index')));

export const Categories = Loadable(lazy(() => import('../pages/categories/Categories')));
export const CategoriesAddPage = Loadable(lazy(() => import('../pages/categories/create/Index')));
export const CategoriesListPage = Loadable(lazy(() => import('../pages/categories/view/Index')));

export const Inventory = Loadable(lazy(() => import('../pages/inventory/Inventory')));
export const InventoryAddPage = Loadable(lazy(() => import('../pages/inventory/create/Index')));
// export const InventoryListPage = Loadable(lazy(() => import('../pages/inventory/view/Index')));
export const InventoryListPage = Loadable(lazy(() => import('../pages/inventory/viewTab/ViewTab')));


export const CompanyPage = Loadable(lazy(() => import('../pages/company/Company')));
export const CompanyAddPage = Loadable(lazy(() => import('../pages/company/create/Index')));
export const CompanyViewPage = Loadable(lazy(() => import('../pages/company/view/Index')));


export const Roles = Loadable(lazy(() => import('../pages/role/Role')));

export const SalesPage = Loadable(lazy(() => import('../pages/salesOrder/SalesOrder')));
export const SalesAddPage = Loadable(lazy(() => import('../pages/salesOrder/create/Index')));
export const SalesViewPage = Loadable(lazy(() => import('../pages/salesOrder/view/Index')));

export const WarrantyPage = Loadable(lazy(() => import('../pages/warrantyMgt/WarrantyMgt')));
export const WarrantyViewPage = Loadable(lazy(() => import('../pages/warrantyMgt/view/Index')));

export const UserPage = Loadable(lazy(() => import('../pages/user/User')));
export const UserArchivePage = Loadable(lazy(() => import('../pages/user/archive/UserArchive')));
export const UserAddPage = Loadable(lazy(() => import('../pages/user/create/Index')));
export const UserViewPage = Loadable(lazy(() => import('../pages/user/view/UserViewPage')));
 
export const ServiceMgtPage = Loadable(lazy(() => import('../pages/serviceMgt/ServiceMgt')));
export const ServiceMgtViewPage = Loadable(lazy(() => import('../pages/serviceMgt/view/ServiceViewPage')));

export const InoutStockListPage = Loadable(lazy(() => import('../pages/inOutRequest/view/Index')));
export const InwardAddPage = Loadable(lazy(() => import('../pages/inOutRequest/inward/create/Inward')));
export const OutwardAddPage = Loadable(lazy(() => import('../pages/inOutRequest/outward/create/Outward')));
export const MainLayoutLab = Loadable(lazy(() => import('../pages/inOutRequest/TabList/MainTab')));
export const InwardListPage = Loadable(lazy(() => import('../pages/inOutRequest/inward/view/Index')));
export const OutwardListPage = Loadable(lazy(() => import('../pages/inOutRequest/outward/view/Index')));

export const ContactInquiryPage = Loadable(lazy(()=>import('../pages/contactInquiry/ContactInquiry')));



// export const SettingPage = Loadable(lazy(() => import('../pages/settings/Setting')));

// ERRORS
// export const NotFoundPage = Loadable(lazy(() => import('./pages/NotFound')));
// export const ForbiddenPage = Loadable(lazy(() => import('./pages/Forbidden')));

// ...Add as many as needed
