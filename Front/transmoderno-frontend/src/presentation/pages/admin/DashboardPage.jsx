import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Spinner } from '../../components/ui/index'
import http from '../../../infrastructure/api/httpClient'
import { useAuth } from '../../../application/context/AuthContext'
import { rutaRepo } from '../../../infrastructure/repositories'

const GREEN  = '#0D5C2F'
const GREEN2 = '#16A34A'

// ── Mini gráfica de barras SVG ────────────────────────────────────────────────
function MiniBar({ data, vk = 'total', lk = 'etiqueta', color = GREEN2 }) {
  if (!data?.length) return <p style={{ color:'#9CA3AF', fontSize:12, padding:'8px 0' }}>Sin datos</p>
  const max = Math.max(...data.map(d => Number(d[vk])||0)) || 1
  const W=280, H=80, PAD={t:4,r:4,b:20,l:4}
  const cW=W-PAD.l-PAD.r, cH=H-PAD.t-PAD.b
  const bW=Math.min(28, cW/data.length-4)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%' }}>
      {data.map((d,i)=>{
        const val=Number(d[vk])||0
        const x=PAD.l+(cW/data.length)*i+(cW/data.length-bW)/2
        const bH=(val/max)*cH, y=PAD.t+cH-bH
        return <g key={i}>
          <rect x={x} y={y} width={bW} height={bH} fill={color} rx={3} opacity={.85}/>
          {bH>12&&<text x={x+bW/2} y={y+bH/2+4} textAnchor="middle" fontSize={9} fill="#fff" fontFamily="DM Sans" fontWeight="700">{val}</text>}
          <text x={x+bW/2} y={PAD.t+cH+14} textAnchor="middle" fontSize={8} fill="#9CA3AF" fontFamily="DM Sans"
            transform={`rotate(-25,${x+bW/2},${PAD.t+cH+14})`}>{String(d[lk]||'').slice(0,10)}</text>
        </g>
      })}
      <line x1={PAD.l} x2={PAD.l+cW} y1={PAD.t+cH} y2={PAD.t+cH} stroke="#E5E7EB"/>
    </svg>
  )
}

// ── KPI card ──────────────────────────────────────────────────────────────────
function Stat({ label, value, icon, color = GREEN, to, sub }) {
  const inner = (
    <div style={{ background:'#fff', borderRadius:14, padding:'18px 20px', border:'1px solid #E5EDE5', boxShadow:'0 1px 4px rgba(0,0,0,.05)', height:'100%', boxSizing:'border-box', transition:'box-shadow .15s' }}
      onMouseEnter={e=>{if(to)e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,.10)'}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,.05)'}}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
        <p style={{ fontSize:10, fontWeight:700, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:1.5, margin:0 }}>{label}</p>
        <span style={{ fontSize:20 }}>{icon}</span>
      </div>
      <p style={{ fontSize:30, fontWeight:800, color, margin:'0 0 4px', lineHeight:1 }}>{value ?? '—'}</p>
      {sub && <p style={{ fontSize:11, color:'#9CA3AF', margin:0 }}>{sub}</p>}
    </div>
  )
  return to ? <Link to={to} style={{ textDecoration:'none', display:'block' }}>{inner}</Link> : inner
}

// ── AlertRow ──────────────────────────────────────────────────────────────────
const NIVEL_DOT = { SIN_ASISTENCIA:'#7c3aed', ALTO:'#dc2626', MODERADO:'#f97316', LEVE:'#f59e0b' }

function AlertRow({ a }) {
  const dot = NIVEL_DOT[a.nivelRiesgo] || '#9CA3AF'
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:'1px solid #F0F4F0' }}>
      <span style={{ width:8, height:8, borderRadius:'50%', background:dot, flexShrink:0 }}/>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontWeight:600, fontSize:13, color:'#111', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {a.nombreCompleto || `Participante #${a.participanteId}`}
        </p>
        <p style={{ fontSize:11, color:'#9CA3AF', margin:0 }}>
          {a.sesionesInasistidas || 0} faltas · <span style={{ color:dot, fontWeight:700 }}>{a.nivelRiesgo}</span>
        </p>
      </div>
    </div>
  )
}

const ROL_LABEL = { ADMIN:'Administrador', PSICOLOGO:'Psicólogo', ENCARGADO:'Encargado' }
const ROL_ICON  = { ADMIN:'👑', PSICOLOGO:'🧠', ENCARGADO:'📋' }

export default function DashboardPage() {
  const { user } = useAuth()
  const rol = user?.rol

  const [loading, setLoading] = useState(true)
  const [stats, setStats]     = useState({ participantes:0, sesiones:0, solicitudes:0, alertas:0 })
  const [alertas, setAlertas] = useState([])
  const [asistChart, setAsistChart] = useState([])
  const [rutas, setRutas]     = useState([])

  const isAdmin = rol === 'ADMIN'
  const isPsi   = rol === 'PSICOLOGO'
  const isEnc   = rol === 'ENCARGADO'

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    setLoading(true)
    try {
      const rs = await rutaRepo.findAll()
      setRutas(rs.filter(r=>r.activa))

      let totalP=0, totalS=0, solicitudes=0, alertasN=0

      try { const r=await http.get('/participantes?page=0&size=1'); totalP=r.totalElementos||0 } catch {}

      if (isAdmin || isEnc) {
        try {
          const activas = rs.filter(r=>r.activa)
          const sArr = await Promise.all(activas.map(r=>http.get(`/sesiones/ruta/${r.id}?page=0&size=1`).catch(()=>({totalElementos:0}))))
          totalS = sArr.reduce((a,r)=>a+(r.totalElementos||0),0)
        } catch {}
      }

      if (isAdmin || isPsi) {
        try {
          const r=await http.get('/alertas/ayuda?page=0&size=50')
          solicitudes=(r.contenido||[]).filter(s=>!s.atendida).length
        } catch {}
      }

      try {
        const r=await http.get('/alertas/inasistencia?page=0&size=5')
        setAlertas(r.contenido||[])
        alertasN=r.totalElementos||0
      } catch {}

      // Mini chart: asistencia por ruta
      try {
        const rIds = rs.filter(r=>r.activa).map(r=>r.id)
        const asistData = rIds.map(id => {
          const ruta = rs.find(r=>r.id===id)
          return { etiqueta: ruta?.nombre?.split(' ')[0]||`R${id}`, rutaId: id, total: 0 }
        })
        setAsistChart(asistData)
      } catch {}

      setStats({ participantes:totalP, sesiones:totalS, solicitudes, alertas:alertasN })
    } catch {}
    setLoading(false)
  }

  if (loading) return <Spinner />

  const hora = new Date().getHours()
  const saludo = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif" }}>

      {/* ── Bienvenida compacta ── */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <p style={{ fontSize:13, color:'var(--gt-muted)', margin:'0 0 3px' }}>{saludo},</p>
          <h1 style={{ fontSize:22, fontWeight:800, color:'var(--gt-text)', margin:0 }}>{user?.nombre}</h1>
        </div>
        <span style={{ display:'inline-flex', alignItems:'center', gap:6, background:'var(--gt-primary-light)', borderRadius:20, padding:'6px 14px', fontSize:13, color:'var(--gt-primary)', fontWeight:700 }}>
          {ROL_ICON[rol]} {ROL_LABEL[rol]||rol}
        </span>
      </div>

      {/* ── KPIs ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:12, marginBottom:20 }}>
        <Stat label="Participantes"  value={stats.participantes} icon="👥" to="/admin/participantes" sub="Registrados en el sistema" />
        {(isAdmin||isEnc) && <Stat label="Sesiones" value={stats.sesiones} icon="📅" color={GREEN} to="/admin/sesiones" sub="Programadas en total" />}
        {(isAdmin||isPsi) && <Stat label="Solicitudes" value={stats.solicitudes} icon="🙋" color="#f97316" to="/admin/alertas" sub="Sin atender" />}
        <Stat label="Alertas inasist." value={stats.alertas} icon="🔔" color="#dc2626" to="/admin/alertas" sub="Registradas" />
      </div>

      {/* ── Fila principal ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>

        {/* Alertas recientes */}
        <div style={{ background:'#fff', borderRadius:16, padding:'20px', border:'1px solid #E5EDE5', boxShadow:'0 1px 4px rgba(0,0,0,.05)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <h3 style={{ fontWeight:800, fontSize:15, color:'#111', margin:0 }}>Alertas recientes</h3>
            <Link to="/admin/alertas" style={{ fontSize:12, color:GREEN, fontWeight:700, textDecoration:'none' }}>Ver todas →</Link>
          </div>
          {alertas.length === 0
            ? <p style={{ fontSize:13, color:'#9CA3AF', textAlign:'center', padding:'20px 0' }}>Sin alertas registradas</p>
            : alertas.slice(0,5).map((a,i) => <AlertRow key={i} a={a} />)
          }
        </div>

        {/* Rutas activas + accesos */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Rutas del programa */}
          <div style={{ background:'#fff', borderRadius:16, padding:'20px', border:'1px solid #E5EDE5', flex:1 }}>
            <h3 style={{ fontWeight:800, fontSize:15, color:'#111', margin:'0 0 14px' }}>Rutas del programa</h3>
            {rutas.length === 0
              ? <p style={{ fontSize:13, color:'#9CA3AF' }}>Sin rutas activas</p>
              : rutas.map((ruta, i) => (
                <div key={ruta.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, background: i===0?'#FEF3DC':'#EDE9FE', marginBottom:8 }}>
                  <span style={{ fontSize:20 }}>{ruta.nombre?.includes('Fallo')?'🔥':'🎨'}</span>
                  <div>
                    <p style={{ fontWeight:700, fontSize:13, color:'#111', margin:0 }}>{ruta.nombre}</p>
                    <p style={{ fontSize:11, color:'#9CA3AF', margin:0 }}>{ruta.descripcion||'Módulo activo'}</p>
                  </div>
                  <span style={{ marginLeft:'auto', width:8, height:8, borderRadius:'50%', background:GREEN2, flexShrink:0 }}/>
                </div>
              ))
            }
          </div>

          {/* Accesos según rol — solo los más relevantes */}
          <div style={{ background:'#fff', borderRadius:16, padding:'20px', border:'1px solid #E5EDE5' }}>
            <h3 style={{ fontWeight:800, fontSize:15, color:'#111', margin:'0 0 12px' }}>Ir a</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {accesosPorRol(rol).slice(0,4).map((item,i) => (
                <Link key={i} to={item.to} style={{
                  display:'flex', alignItems:'center', gap:8, padding:'9px 12px', borderRadius:10,
                  background:item.bg, color:'#111', textDecoration:'none', fontSize:12, fontWeight:600,
                }}>
                  <span style={{ fontSize:18 }}>{item.icon}</span> {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Reporte rápido ── */}
      <div style={{ background:'#fff', borderRadius:16, padding:'20px', border:'1px solid #E5EDE5', boxShadow:'0 1px 4px rgba(0,0,0,.05)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <h3 style={{ fontWeight:800, fontSize:15, color:'#111', margin:0 }}>Vista rápida — Reportes</h3>
          <Link to="/admin/reportes" style={{ fontSize:12, color:GREEN, fontWeight:700, textDecoration:'none' }}>Ver reportes completos →</Link>
        </div>
        <p style={{ fontSize:12, color:'#9CA3AF', margin:'0 0 12px' }}>Accede a reportes estadísticos completos con exportación PDF, Excel y CSV.</p>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          {['Asistencia por ruta','PRE vs POST','Retención','Tendencia semanal'].map((item,i)=>(
            <Link key={i} to="/admin/reportes" style={{ padding:'7px 14px', borderRadius:8, background:'var(--gt-bg)', fontSize:12, fontWeight:600, color:'#374151', textDecoration:'none', border:'1px solid var(--gt-border)' }}>{item}</Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function accesosPorRol(rol) {
  const all = [
    { to:'/admin/participantes', label:'Participantes', icon:'👥', bg:'#E8F5ED', roles:['ADMIN','PSICOLOGO','ENCARGADO'] },
    { to:'/admin/sesiones',      label:'Sesiones',      icon:'📅', bg:'#E0F2FE', roles:['ADMIN','ENCARGADO'] },
    { to:'/admin/fichas',        label:'Fichas',        icon:'📝', bg:'#FEF9C3', roles:['ADMIN','PSICOLOGO'] },
    { to:'/admin/alertas',       label:'Alertas',       icon:'🔔', bg:'#FEE2E2', roles:['ADMIN','PSICOLOGO','ENCARGADO'] },
    { to:'/admin/reportes',      label:'Reportes',      icon:'📊', bg:'#EDE9FE', roles:['ADMIN','PSICOLOGO','ENCARGADO'] },
    { to:'/admin/usuarios',      label:'Usuarios',      icon:'🛡', bg:'#F0F4F1', roles:['ADMIN'] },
  ]
  return all.filter(a=>a.roles.includes(rol))
}
