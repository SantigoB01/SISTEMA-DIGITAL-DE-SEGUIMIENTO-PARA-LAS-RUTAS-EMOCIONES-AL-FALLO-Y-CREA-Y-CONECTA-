import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './application/context/AuthContext'
import { ToastProvider } from './application/context/ToastContext'

import LandingPage from './presentation/pages/LandingPage'
import LoginPage from './presentation/pages/LoginPage'
import AdminLayout from './presentation/layouts/AdminLayout'
import StudentLayout from './presentation/layouts/StudentLayout'
import StudentEnterPage from './presentation/pages/student/StudentEnterPage'
import StudentHomePage from './presentation/pages/student/StudentHomePage'
import {
  ParticipantesPage, RutasPage, SesionesPage, InscripcionesPage,
  AsistenciaPage, FichasPage, AlertasPage, ReportesPage, UsuariosPage
} from './presentation/pages/admin'

function ProtectedAdmin({ children }) {
  const { isStaff } = useAuth()
  return isStaff ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Student routes — sin auth, identificación por número */}
      <Route path="/student" element={<StudentLayout />}>
        <Route path="home" element={<StudentHomePage />} />
      </Route>
      <Route path="/student/enter" element={<StudentEnterPage />} />

      {/* Admin routes — requiere login */}
      <Route path="/admin" element={<ProtectedAdmin><AdminLayout /></ProtectedAdmin>}>
        <Route index element={<Navigate to="participantes" replace />} />
        <Route path="participantes" element={<ParticipantesPage />} />
        <Route path="rutas" element={<RutasPage />} />
        <Route path="sesiones" element={<SesionesPage />} />
        <Route path="inscripciones" element={<InscripcionesPage />} />
        <Route path="asistencia" element={<AsistenciaPage />} />
        <Route path="fichas" element={<FichasPage />} />
        <Route path="alertas" element={<AlertasPage />} />
        <Route path="reportes" element={<ReportesPage />} />
        <Route path="usuarios" element={<UsuariosPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ToastProvider>
  )
}
