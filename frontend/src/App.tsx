import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/router/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { PlansPage } from '@/pages/PlansPage'
import { CreatePlanPage } from '@/pages/CreatePlanPage'
import { PlanDetailPage } from '@/pages/PlanDetailPage'
import { LogWorkoutPage } from '@/pages/LogWorkoutPage'
import { LogHistoryPage } from '@/pages/LogHistoryPage'
import { ReportsPage } from '@/pages/ReportsPage'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="px-16 py-12">
      <h1 className="text-2xl font-black tracking-tight" style={{ color: '#dae2fd' }}>{title}</h1>
      <p className="mt-2 text-sm" style={{ color: '#bec8d2' }}>Coming soon.</p>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Login — standalone full-page layout */}
      <Route path="/login" element={<LoginPage />} />

      {/* Register — standalone full-page layout */}
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/plans/new" element={<CreatePlanPage />} />
          <Route path="/plans/:id" element={<PlanDetailPage />} />
          <Route path="/log" element={<LogWorkoutPage />} />
          <Route path="/history" element={<LogHistoryPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/profile" element={<PlaceholderPage title="Profile" />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
