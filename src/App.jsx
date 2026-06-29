import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import Home from './pages/Home';
import Loader from './components/ui/Loader';
import { useAuth } from './context/AuthContext';

const Cars         = lazy(() => import('./pages/Cars'));
const CarDetails   = lazy(() => import('./pages/CarDetails'));
const About        = lazy(() => import('./pages/About'));
const Contact      = lazy(() => import('./pages/Contact'));
const NotFound     = lazy(() => import('./pages/NotFound'));
const Login        = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword  = lazy(() => import('./pages/ResetPassword'));

const AdminDashboard   = lazy(() => import('./pages/admin/Dashboard'));
const AdminCars        = lazy(() => import('./pages/admin/Cars'));
const AdminEnquiries   = lazy(() => import('./pages/admin/Enquiries'));
const AdminCommissions = lazy(() => import('./pages/admin/Commissions'));
const AdminOwners      = lazy(() => import('./pages/admin/Owners'));
const AdminSoldCars    = lazy(() => import('./pages/admin/SoldCars'));
const AdminCarRepairs  = lazy(() => import('./pages/admin/CarRepairs'));
const AdminUsers            = lazy(() => import('./pages/admin/Users'));
const AdminPrivileges       = lazy(() => import('./pages/admin/Privileges'));
const AdminCarSaleRequests  = lazy(() => import('./pages/admin/CarSaleRequests'));
const SellYourCar           = lazy(() => import('./pages/SellYourCar'));

const PageLoader = () => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh' }}>
    <Loader size="lg" />
  </div>
);

// Page key → route path mapping (in access priority order)
const ADMIN_PAGE_ROUTES = [
  { key: 'dashboard',   path: '/admin/dashboard'   },
  { key: 'cars',        path: '/admin/cars'         },
  { key: 'owners',      path: '/admin/owners'       },
  { key: 'enquiries',   path: '/admin/enquiries'    },
  { key: 'sold-cars',   path: '/admin/sold-cars'    },
  { key: 'commissions', path: '/admin/commissions'  },
  { key: 'sale-requests', path: '/admin/sale-requests' },
  { key: 'repairs',     path: '/admin/repairs'      },
  { key: 'users',       path: '/admin/users'        },
];

function AccessDenied() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
      <div style={{ fontSize: '3rem' }}>🔒</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.5rem', color: '#040404', margin: 0 }}>Access Denied</h2>
      <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: 0 }}>You don't have permission to view this page.</p>
    </div>
  );
}

// Redirects to first accessible page (or dashboard for full admins)
function SmartAdminIndex() {
  const { isFullAdmin, can } = useAuth();
  if (isFullAdmin) return <Navigate to="/admin/dashboard" replace />;
  for (const { key, path } of ADMIN_PAGE_ROUTES) {
    if (can(key)) return <Navigate to={path} replace />;
  }
  return <AccessDenied />;
}

// Guards a specific page by permission key
function PageGuard({ permKey, children }) {
  const { isFullAdmin, can } = useAuth();
  if (isFullAdmin || can(permKey)) return children;
  return <AccessDenied />;
}

function ProtectedRoute() {
  const { isLoggedIn, isAdmin } = useAuth();
  if (!isLoggedIn || !isAdmin) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/"          element={<Home />} />
            <Route path="/cars"           element={<Cars />} />
            <Route path="/cars/:id"       element={<CarDetails />} />
            <Route path="/about"          element={<About />} />
            <Route path="/contact"        element={<Contact />} />
            <Route path="/sell-your-car"  element={<SellYourCar />} />
          </Route>

          <Route path="/admin/login"           element={<Login />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/reset-password"  element={<ResetPassword />} />

          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index                element={<SmartAdminIndex />} />
              <Route path="dashboard"     element={<PageGuard permKey="dashboard"><AdminDashboard /></PageGuard>} />
              <Route path="cars"          element={<PageGuard permKey="cars"><AdminCars /></PageGuard>} />
              <Route path="enquiries"     element={<PageGuard permKey="enquiries"><AdminEnquiries /></PageGuard>} />
              <Route path="commissions"   element={<PageGuard permKey="commissions"><AdminCommissions /></PageGuard>} />
              <Route path="owners"        element={<PageGuard permKey="owners"><AdminOwners /></PageGuard>} />
              <Route path="sold-cars"     element={<PageGuard permKey="sold-cars"><AdminSoldCars /></PageGuard>} />
              <Route path="repairs"       element={<PageGuard permKey="repairs"><AdminCarRepairs /></PageGuard>} />
              <Route path="users"            element={<PageGuard permKey="users"><AdminUsers /></PageGuard>} />
              <Route path="privileges"       element={<PageGuard permKey="users"><AdminPrivileges /></PageGuard>} />
              <Route path="sale-requests"    element={<PageGuard permKey="cars"><AdminCarSaleRequests /></PageGuard>} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
