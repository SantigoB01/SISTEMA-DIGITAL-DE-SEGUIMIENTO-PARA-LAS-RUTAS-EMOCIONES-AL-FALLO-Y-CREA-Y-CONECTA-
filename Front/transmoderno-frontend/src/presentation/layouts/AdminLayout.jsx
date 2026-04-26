import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Icon from '../components/ui/Icon'
import { useAuth } from '../../application/context/AuthContext'

const NAV = [
  { to:'/admin/participantes', label:'Participantes', icon:'users' },
  { to:'/admin/rutas', label:'Rutas', icon:'route' },
  { to:'/admin/sesiones', label:'Sesiones', icon:'calendar' },
  { to:'/admin/inscripciones', label:'Inscripciones', icon:'clipboard' },
  { to:'/admin/asistencia', label:'Asistencia', icon:'check' },
  { to:'/admin/fichas', label:'Fichas', icon:'clipboard' },
  { to:'/admin/alertas', label:'Alertas', icon:'bell' },
  { to:'/admin/reportes', label:'Reportes', icon:'chart' },
  { to:'/admin/usuarios', label:'Usuarios', icon:'shield' },
]

export default function AdminLayout() {
  const [open, setOpen] = useState(true)
  const { user, logout } = useAuth()
  const nav = useNavigate()

  const doLogout = () => { logout(); nav('/login') }

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      <aside style={{
        width:open?260:72, background:'#fff', borderRight:'1px solid #e8ece8',
        transition:'width .3s', display:'flex', flexDirection:'column', flexShrink:0, overflow:'hidden'
      }}>
        <div onClick={()=>setOpen(!open)} style={{padding:open?'24px 20px':'24px 12px',borderBottom:'1px solid #e8ece8',display:'flex',alignItems:'center',gap:12,cursor:'pointer'}}>
          <div style={{width:40,height:40,borderRadius:12,background:'linear-gradient(135deg,#16a34a,#22c55e)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 2px 8px rgba(22,163,74,.3)'}}>
            <span style={{color:'#fff',fontWeight:700,fontSize:18,fontFamily:"'Playfair Display',serif"}}>G</span>
          </div>
          {open&&<div><div style={{fontWeight:700,fontSize:15,color:'#111',whiteSpace:'nowrap'}}>Transmoderno</div><div style={{fontSize:11,color:'#9ca3af',whiteSpace:'nowrap'}}>UCundinamarca · Fusagasugá</div></div>}
        </div>

        <nav style={{flex:1,padding:'12px 8px',display:'flex',flexDirection:'column',gap:2}}>
          {NAV.map(n=>(
            <NavLink key={n.to} to={n.to} style={({isActive})=>({
              display:'flex',alignItems:'center',gap:12,padding:open?'10px 14px':'10px 0',
              justifyContent:open?'flex-start':'center',borderRadius:10,border:'none',
              transition:'all .2s',background:isActive?'#f0faf0':'transparent',
              color:isActive?'#16a34a':'#6b7280',fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:isActive?600:500
            })}>
              {({isActive})=><><Icon name={n.icon} size={20} color={isActive?'#16a34a':'#9ca3af'}/>{open&&<span style={{whiteSpace:'nowrap'}}>{n.label}</span>}</>}
            </NavLink>
          ))}
        </nav>

        <div style={{padding:16,borderTop:'1px solid #e8ece8'}}>
          {open&&user&&<div style={{fontSize:13,color:'#374151',marginBottom:8,fontWeight:600}}>{user.nombre}<br/><span style={{fontWeight:400,color:'#9ca3af',fontSize:12}}>{user.rol}</span></div>}
          <button onClick={doLogout} style={{display:'flex',alignItems:'center',gap:8,width:'100%',padding:'8px 12px',borderRadius:8,border:'none',background:'#fef2f2',color:'#dc2626',fontSize:13,fontWeight:600,justifyContent:open?'flex-start':'center'}}>
            <Icon name="logout" size={16} color="#dc2626"/>{open&&'Cerrar sesión'}
          </button>
        </div>
      </aside>

      <main style={{flex:1,padding:32,overflowY:'auto',maxHeight:'100vh'}}>
        <Outlet/>
      </main>
    </div>
  )
}
