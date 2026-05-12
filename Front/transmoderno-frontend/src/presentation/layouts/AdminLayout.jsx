import { NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../application/context/AuthContext'
import http from '../../infrastructure/api/httpClient'

// ── Permisos por rol ────────────────────────────────────────────────────────
const PERMISOS = {
  ADMIN:     ['/admin/dashboard','/admin/participantes','/admin/rutas','/admin/sesiones','/admin/inscripciones','/admin/asistencia','/admin/fichas','/admin/alertas','/admin/reportes','/admin/usuarios'],
  PSICOLOGO: ['/admin/dashboard','/admin/participantes','/admin/fichas','/admin/alertas','/admin/reportes'],
  ENCARGADO: ['/admin/dashboard','/admin/participantes','/admin/sesiones','/admin/asistencia','/admin/alertas','/admin/reportes'],
}

export function puedeAcceder(rol, path) {
  return (PERMISOS[rol] || []).includes(path)
}

// ── Nav por rol ─────────────────────────────────────────────────────────────
const NAV_ADMIN = [
  { label: 'PRINCIPAL', items: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '▪' },
  ]},
  { label: 'GESTIÓN', items: [
    { to: '/admin/participantes', label: 'Participantes', icon: '👥' },
    { to: '/admin/rutas',         label: 'Rutas',       icon: '🗺' },
    { to: '/admin/inscripciones', label: 'Inscripciones', icon: '📋' },
    { to: '/admin/asistencia',    label: 'Asistencia',    icon: '✅' },
  ]},
  { label: 'EVALUACIÓN', items: [
    { to: '/admin/fichas',   label: 'Fichas',   icon: '📝' },
    { to: '/admin/alertas',  label: 'Alertas',  icon: '🔔', badge: true },
    { to: '/admin/reportes', label: 'Reportes', icon: '📊' },
  ]},
  { label: 'SISTEMA', items: [
    { to: '/admin/usuarios', label: 'Usuarios staff', icon: '🛡' },
  ]},
]

const NAV_PSICOLOGO = [
  { label: 'PRINCIPAL', items: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '🏠' },
  ]},
  { label: 'GESTIÓN', items: [
    { to: '/admin/participantes', label: 'Participantes', icon: '👥' },
  ]},
  { label: 'EVALUACIÓN', items: [
    { to: '/admin/fichas',   label: 'Fichas',   icon: '📝' },
    { to: '/admin/alertas',  label: 'Alertas',  icon: '🔔', badge: true },
    { to: '/admin/reportes', label: 'Reportes', icon: '📊' },
  ]},
]

const NAV_ENCARGADO = [
  { label: 'PRINCIPAL', items: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '▪' },
  ]},
  { label: 'GESTIÓN', items: [
    { to: '/admin/participantes', label: 'Participantes', icon: '👥' },
    { to: '/admin/asistencia',    label: 'Asistencia',    icon: '✅' },
  ]},
  { label: 'EVALUACIÓN', items: [
    { to: '/admin/alertas',  label: 'Alertas',  icon: '🔔', badge: true },
    { to: '/admin/reportes', label: 'Reportes', icon: '📊' },
  ]},
]

const NAV_BY_ROL = { ADMIN: NAV_ADMIN, PSICOLOGO: NAV_PSICOLOGO, ENCARGADO: NAV_ENCARGADO }

const ROL_COLOR = { ADMIN: '#C8952A', PSICOLOGO: '#38bdf8', ENCARGADO: '#4ade80' }
const ROL_ICON  = { ADMIN: '👑', PSICOLOGO: '🧠', ENCARGADO: '📋' }

// ── Guardia de ruta por rol ─────────────────────────────────────────────────
export function RequireRole({ path, children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login/admin" replace />
  if (!puedeAcceder(user.rol, path)) {
    const fallback = PERMISOS[user.rol]?.[0] || '/admin/dashboard'
    return <Navigate to={fallback} replace />
  }
  return children
}

// ── NavItem ─────────────────────────────────────────────────────────────────
function NavItem({ to, label, icon, badgeCount }) {
  return (
    <NavLink to={to} style={({ isActive }) => ({
      display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
      borderRadius: 8, marginBottom: 1, textDecoration: 'none', fontSize: 13, fontWeight: 500,
      background: isActive ? 'rgba(255,255,255,.18)' : 'transparent',
      color: isActive ? '#fff' : 'rgba(255,255,255,.65)',
      transition: 'all .15s',
    })}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.09)'; e.currentTarget.style.color = '#fff' }}
      onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '' }}
    >
      <span style={{ fontSize: 15, lineHeight: 1 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badgeCount > 0 && (
        <span style={{ background: 'var(--gt-danger)', color: '#fff', borderRadius: 10, fontSize: 10, fontWeight: 800, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>
          {badgeCount}
        </span>
      )}
    </NavLink>
  )
}

// ── AdminLayout ─────────────────────────────────────────────────────────────
export default function AdminLayout() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const [pendientes, setPendientes] = useState(0)

  const rol     = user?.rol || 'ADMIN'
  const sections = NAV_BY_ROL[rol] || NAV_ADMIN

  useEffect(() => {
    if (rol !== 'ENCARGADO') {
      const fetch = async () => {
        try {
          const r = await http.get('/alertas/ayuda/pendientes/count')
          setPendientes(typeof r === 'number' ? r : r?.count || 0)
        } catch {}
      }
      fetch()
      const id = setInterval(fetch, 30000)
      return () => clearInterval(id)
    }
  }, [rol])

  const doLogout = () => { logout(); nav('/') }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--gt-bg)' }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 'var(--gt-sidebar-w)', flexShrink: 0, background: 'var(--gt-primary)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

        {/* Logo */}
        <div style={{ padding: '18px 14px 14px', borderBottom: '1px solid rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>G</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>Transmoderno</div>
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 11 }}>UCundinamarca</div>
          </div>
        </div>

        {/* Perfil badge */}
        <div style={{ margin: '10px 10px 4px', background: 'rgba(255,255,255,.08)', borderRadius: 10, padding: '10px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
              {(user?.nombre || 'A').split(' ').slice(0,2).map(n => n[0]).join('')}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.nombre?.split(' ')[0]} {user?.nombre?.split(' ')[1] || ''}
              </div>
              <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.correo}</div>
            </div>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,.12)', borderRadius: 20, padding: '3px 10px' }}>
            <span style={{ fontSize: 12 }}>{ROL_ICON[rol]}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: ROL_COLOR[rol] || '#fff' }}>
              {{ ADMIN: 'Administrador', PSICOLOGO: 'Psicólogo', ENCARGADO: 'Encargado' }[rol] || rol}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 8px' }}>
          {sections.map(sec => (
            <div key={sec.label}>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: 2, textTransform: 'uppercase', padding: '12px 10px 4px', display: 'block' }}>
                {sec.label}
              </span>
              {sec.items.map(item => (
                <NavItem key={item.to} to={item.to} label={item.label} icon={item.icon} badgeCount={item.badge ? pendientes : 0} />
              ))}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,.1)' }}>
          <button onClick={doLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'none', border: 'none', color: 'rgba(255,255,255,.6)', fontSize: 13, cursor: 'pointer', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", transition: 'all .15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,.2)'; e.currentTarget.style.color = '#fca5a5' }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '' }}>
            <span>🚪</span> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: 28, maxWidth: 1100, minHeight: '100%' }} className="page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
