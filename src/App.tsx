import { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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


function ProtectedRoute({ children }: { children: ReactNode }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
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
    </BrowserRouter>
  );
}

export default App;