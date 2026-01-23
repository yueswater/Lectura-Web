import { ReactNode, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import Home from './pages/home/Home';
import Dashboard from './pages/dashboard/overview/Dashboard';
import Projects from './pages/dashboard/projects/Projects';
import ProjectDetails from './pages/dashboard/projects/ProjectDetails';
import Handouts from './pages/dashboard/handouts/Handouts';
import HandoutDetails from './pages/dashboard/handouts/HandoutDetails';
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import authService from './services/authService';
import Profile from './pages/profile/Profile';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPasswordConfirm from './pages/auth/ResetPasswordConfirm';
import WritingOverlay from './components/common/WritingOverlay';

function ProtectedRoute({ children }: { children: ReactNode }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

const NavigationWrapper = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    const isDashboardPath = location.pathname.startsWith('/dashboard') ||
      location.pathname.startsWith('/projects') ||
      location.pathname.startsWith('/handouts') ||
      location.pathname.startsWith('/profile');

    if (isDashboardPath) {
      setIsPageLoading(true);
    }

    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <WritingOverlay isVisible={isPageLoading} message={t("common.transitioning")} />
      {children}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <NavigationWrapper>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPasswordConfirm />} />

          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/projects" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Projects />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/projects/:id" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProjectDetails />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/handouts" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Handouts />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/handouts/:id" element={
            <ProtectedRoute>
              <DashboardLayout>
                <HandoutDetails />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/settings" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </NavigationWrapper>
    </BrowserRouter>
  );
}

export default App;