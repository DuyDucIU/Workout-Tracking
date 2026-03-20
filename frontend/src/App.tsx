import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/router/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'

export default function App() {
  return (
    <Routes>
      {/* Login — standalone full-page layout */}
      <Route path="/login" element={<LoginPage />} />

      {/* Register — still wrapped in AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
