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

const AdminDashboard   = lazy(() => import('./pages/admin/Dashboard'));
const AdminCars        = lazy(() => import('./pages/admin/Cars'));
const AdminEnquiries   = lazy(() => import('./pages/admin/Enquiries'));
const AdminCommissions = lazy(() => import('./pages/admin/Commissions'));
const AdminOwners      = lazy(() => import('./pages/admin/Owners'));

const PageLoader = () => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh' }}>
    <Loader size="lg" />
  </div>
);

// Guard for admin routes
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
            <Route path="/cars"      element={<Cars />} />
            <Route path="/cars/:id"  element={<CarDetails />} />
            <Route path="/about"     element={<About />} />
            <Route path="/contact"   element={<Contact />} />
          </Route>

          <Route path="/admin/login" element={<Login />} />

          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index                element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard"     element={<AdminDashboard />} />
              <Route path="cars"          element={<AdminCars />} />
              <Route path="enquiries"     element={<AdminEnquiries />} />
              <Route path="commissions"   element={<AdminCommissions />} />
              <Route path="owners"        element={<AdminOwners />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
