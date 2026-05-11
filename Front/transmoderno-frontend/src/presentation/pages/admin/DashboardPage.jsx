import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { StatCard, Card, PageHeader, Spinner } from '../../components/ui/index'
import http from '../../../infrastructure/api/httpClient'
import { useAuth } from '../../../application/context/AuthContext'
import { rutaRepo } from '../../../infrastructure/repositories'

const MODULOS = [
  { nombre: 'Emociones al Fallo', desc: 'Regulación emocional y bienestar psicológico', icon: '🔥', color: '#FEF3DC', colorText: '#92400E' },
  { nombre: 'Crea y Conecta',     desc: 'Creatividad, expresión y vínculos sociales',   icon: '🎨', color: '#EDE9FE', colorText: '#5B21B6' },
]

const NIVEL_COLOR = { ALTO: 'var(--gt-danger)', MODERADO: 'var(--gt-warn)', LEVE: '#f59e0b' }

const ROL_LABEL = { ADMIN: 'Administrador', PSICOLOGO: 'Psicólogo', ENCARGADO: 'Encargado' }

export default function DashboardPage() {
  const { user, isAdmin, isEncargado, isPsicologo } = useAuth()
  const rol = user?.rol

  const [loading, setLoading]   = useState(true)
  const [stats, setStats]       = useState({ participantes: 0, sesiones: 0, solicitudes: 0, alertas: 0 })
  const [alertas, setAlertas]   = useState([])
  const [modulos, setModulos]   = useState([])

  useEffect(() => { cargarTodo() }, [])

  const cargarTodo = async () => {
    setLoading(true)
    try {
      // Módulos del back (los 2 fijos)
      const rs = await rutaRepo.findAll()
      setModulos(rs.filter(r => r.activa))

      // Participantes
      let totalP = 0
      try { const r = await http.get('/participantes?page=0&size=1'); totalP = r.totalElementos || 0 } catch {}

      // Sesiones (admin + encargado)
      let totalS = 0
      if (isAdmin || isEncargado) {
        try {
          const activas = rs.filter(r => r.activa)
          const sArr = await Promise.all(activas.map(r => http.get(`/sesiones/ruta/${r.id}?page=0&size=1`).catch(() => ({ totalElementos: 0 }))))
          totalS = sArr.reduce((a, r) => a + (r.totalElementos || 0), 0)
        } catch {}
      }

      // Solicitudes ayuda (admin + psicologo)
      let solicitudes = 0
      if (isAdmin || isPsicologo) {
        try {
          const r = await http.get('/alertas/ayuda?page=0&size=50')
          solicitudes = (r.contenido || []).filter(s => !s.atendida).length
        } catch {}
      }

      // Alertas inasistencia (todos)
      let totalA = 0
      try {
        const r = await http.get('/alertas/inasistencia?page=0&size=5')
        setAlertas(r.contenido || [])
        totalA = r.totalElementos || 0
      } catch {}

      setStats({ participantes: totalP, sesiones: totalS, solicitudes, alertas: totalA })
    } catch {}
    setLoading(false)
  }

  if (loading) return <Spinner />

  const hora = new Date().getHours()
  const saludo = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div>
      {/* ── Bienvenida ── */}
      <div style={{ background: 'linear-gradient(135deg,#0D5C2F,#16A34A)', borderRadius: 16, padding: '22px 24px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 13, margin: '0 0 4px' }}>{saludo},</p>
          <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>{user?.nombre}</h2>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.15)', borderRadius: 20, padding: '3px 12px', fontSize: 12, color: 'rgba(255,255,255,.9)', fontWeight: 600 }}>
            {{ ADMIN: '👑', PSICOLOGO: '🧠', ENCARGADO: '📋' }[rol]} {ROL_LABEL[rol] || rol}
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 12, margin: 0 }}>
            {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
        <StatCard label="Participantes" value={stats.participantes} sub="Registrados" icon="👥" />

        {(isAdmin || isEncargado) && (
          <StatCard label="Sesiones" value={stats.sesiones} sub="Programadas" icon="📅" color="var(--gt-primary)" />
        )}

        {(isAdmin || isPsicologo) && (
          <StatCard label="Solicitudes" value={stats.solicitudes} sub="Sin atender" icon="🙋" color="var(--gt-danger)" />
        )}

        <StatCard label="Alertas" value={stats.alertas} sub="Por inasistencia" icon="🔔" color="var(--gt-warn)" />
      </div>

      {/* ── Fila principal ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>

        {/* Módulos fijos */}
        <Card>
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontWeight: 800, fontSize: 15, color: 'var(--gt-text)', margin: '0 0 2px' }}>Módulos del programa</h3>
            <p style={{ fontSize: 12, color: 'var(--gt-muted)', margin: 0 }}>Programas activos en Gimnasio Transmoderno</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {modulos.length === 0
              ? MODULOS.map((m, i) => <ModuloCard key={i} {...m} />)
              : modulos.map((r, i) => {
                  const def = MODULOS.find(m => r.nombre?.toLowerCase().includes(m.nombre.split(' ')[0].toLowerCase())) || MODULOS[i % 2]
                  return <ModuloCard key={r.id} nombre={r.nombre} desc={r.descripcion || def.desc} icon={def.icon} color={def.color} colorText={def.colorText} />
                })
            }
          </div>
        </Card>

        {/* Alertas recientes */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontWeight: 800, fontSize: 15, color: 'var(--gt-text)', margin: 0 }}>Alertas recientes</h3>
            <Link to="/admin/alertas" style={{ fontSize: 12, color: 'var(--gt-primary)', fontWeight: 700, textDecoration: 'none' }}>Ver todas →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alertas.length === 0
              ? <p style={{ fontSize: 13, color: 'var(--gt-muted)', textAlign: 'center', padding: '20px 0' }}>Sin alertas registradas</p>
              : alertas.slice(0, 5).map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: NIVEL_COLOR[a.nivelRiesgo] || '#9ca3af', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--gt-text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {a.nombreCompleto || `Participante #${a.participanteId}`}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--gt-muted)', margin: 0 }}>
                      {a.sesionesInasistidas} faltas · <span style={{ color: NIVEL_COLOR[a.nivelRiesgo] || 'var(--gt-muted)', fontWeight: 700 }}>{a.nivelRiesgo}</span>
                    </p>
                  </div>
                </div>
              ))
            }
          </div>
        </Card>
      </div>

      {/* ── Accesos rápidos según rol ── */}
      <Card>
        <h3 style={{ fontWeight: 800, fontSize: 15, color: 'var(--gt-text)', marginBottom: 14 }}>Accesos rápidos</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
          {accesosPorRol(rol).map((item, i) => (
            <Link key={i} to={item.to} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 12, background: item.bg, color: 'var(--gt-text)', textDecoration: 'none', fontWeight: 600, fontSize: 13, transition: 'opacity .15s' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '.8' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}

function ModuloCard({ nombre, desc, icon, color, colorText }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: color }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <p style={{ fontWeight: 700, fontSize: 14, color: colorText, margin: '0 0 2px' }}>{nombre}</p>
        <p style={{ fontSize: 12, color: colorText, opacity: .75, margin: 0 }}>{desc}</p>
      </div>
    </div>
  )
}

function accesosPorRol(rol) {
  const all = [
    { to: '/admin/participantes', label: 'Participantes', icon: '👥', bg: '#E8F5ED',  roles: ['ADMIN','PSICOLOGO','ENCARGADO'] },
    { to: '/admin/sesiones',      label: 'Sesiones',      icon: '📅', bg: '#E0F2FE',  roles: ['ADMIN','ENCARGADO'] },
    { to: '/admin/asistencia',    label: 'Asistencia',    icon: '✅', bg: '#F0FDF4',  roles: ['ADMIN','ENCARGADO'] },
    { to: '/admin/inscripciones', label: 'Inscripciones', icon: '📋', bg: '#FEF3DC',  roles: ['ADMIN'] },
    { to: '/admin/fichas',        label: 'Fichas',        icon: '📝', bg: '#FEF9C3',  roles: ['ADMIN','PSICOLOGO'] },
    { to: '/admin/alertas',       label: 'Alertas',       icon: '🔔', bg: '#FEE2E2',  roles: ['ADMIN','PSICOLOGO','ENCARGADO'] },
    { to: '/admin/reportes',      label: 'Reportes',      icon: '📊', bg: '#EDE9FE',  roles: ['ADMIN','PSICOLOGO','ENCARGADO'] },
    { to: '/admin/usuarios',      label: 'Usuarios',      icon: '🛡', bg: '#F0F4F1',  roles: ['ADMIN'] },
  ]
  return all.filter(a => a.roles.includes(rol))
}
