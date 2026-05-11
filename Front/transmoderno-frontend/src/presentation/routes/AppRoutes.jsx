import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../../application/context/AuthContext'
import AdminLayout, { RequireRole } from '../layouts/AdminLayout'
import StudentLayout from '../layouts/StudentLayout'
import WelcomePage from '../pages/WelcomePage'
import LoginAdminPage from '../pages/LoginAdminPage'
import LoginEstudiantePage from '../pages/LoginEstudiantePage'
import RegisterPage from '../pages/RegisterPage'
import StudentHomePage from '../pages/student/StudentHomePage'
import DashboardPage from '../pages/admin/DashboardPage'
import ParticipantesPage from '../pages/admin/ParticipantesPage'
import RutasPage from '../pages/admin/RutasPage'
import SesionesPage from '../pages/admin/SesionesPage'
import InscripcionesPage from '../pages/admin/InscripcionesPage'
import AsistenciaPage from '../pages/admin/AsistenciaPage'
import FichasPage from '../pages/admin/FichasPage'
import AlertasPage from '../pages/admin/AlertasPage'
import ReportesPage from '../pages/admin/ReportesPage'
import UsuariosPage from '../pages/admin/UsuariosPage'

function RequireAuth({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login/admin" replace />
}

// Ruta protegida: verifica autenticación Y rol
function RolRoute({ path, element }) {
  return (
    <RequireAuth>
      <RequireRole path={path}>{element}</RequireRole>
    </RequireAuth>
  )
}

export default function AppRoutes() {
  const { user } = useAuth()

  // Redirige a la primera ruta permitida según rol al entrar a /admin
  const adminDefault = () => {
    if (!user) return '/login/admin'
    const map = { ADMIN: '/admin/dashboard', PSICOLOGO: '/admin/dashboard', ENCARGADO: '/admin/dashboard' }
    return map[user.rol] || '/admin/dashboard'
  }

  return (
    <Routes>
      {/* Bienvenida */}
      <Route path="/" element={<WelcomePage />} />

      {/* Auth */}
      <Route path="/login/admin"      element={<LoginAdminPage />} />
      <Route path="/login/estudiante" element={<LoginEstudiantePage />} />
      <Route path="/register"         element={<RegisterPage />} />

      {/* Estudiante */}
      <Route path="/student" element={<StudentLayout />}>
        <Route path="home" element={<StudentHomePage />} />
        <Route index       element={<Navigate to="/student/home" replace />} />
      </Route>

      {/* Admin — layout envuelve todo */}
      <Route path="/admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
        <Route index element={<Navigate to={adminDefault()} replace />} />

        {/* Todos los roles */}
        <Route path="dashboard"  element={<RolRoute path="/admin/dashboard"  element={<DashboardPage />} />} />
        <Route path="participantes" element={<RolRoute path="/admin/participantes" element={<ParticipantesPage />} />} />
        <Route path="alertas"    element={<RolRoute path="/admin/alertas"    element={<AlertasPage />} />} />
        <Route path="reportes"   element={<RolRoute path="/admin/reportes"   element={<ReportesPage />} />} />

        {/* ADMIN + ENCARGADO */}
        <Route path="sesiones"   element={<RolRoute path="/admin/sesiones"   element={<SesionesPage />} />} />
        <Route path="asistencia" element={<RolRoute path="/admin/asistencia" element={<AsistenciaPage />} />} />

        {/* ADMIN + PSICOLOGO */}
        <Route path="fichas"     element={<RolRoute path="/admin/fichas"     element={<FichasPage />} />} />

        {/* Solo ADMIN */}
        <Route path="rutas"         element={<RolRoute path="/admin/rutas"         element={<RutasPage />} />} />
        <Route path="inscripciones" element={<RolRoute path="/admin/inscripciones" element={<InscripcionesPage />} />} />
        <Route path="usuarios"      element={<RolRoute path="/admin/usuarios"       element={<UsuariosPage />} />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
