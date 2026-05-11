import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../application/context/ToastContext'
import { participanteRepo } from '../../infrastructure/repositories'

export default function LoginEstudiantePage() {
  const nav = useNavigate()
  const toast = useToast()
  const [cedula, setCedula] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!cedula.trim()) return
    setLoading(true)
    try {
      const p = await participanteRepo.findByIdentificacion(cedula.trim())
      if (!p.activo) {
        toast('Tu cuenta está desactivada. Contacta al administrador.', 'error')
        setLoading(false)
        return
      }
      localStorage.setItem('tm_student', JSON.stringify(p))
      toast(`¡Hola, ${p.nombreCompleto.split(' ')[0]}!`)
      nav('/student/home')
    } catch {
      toast('Número de identificación no encontrado. ¿Quieres crear una cuenta?', 'error')
    }
    setLoading(false)
  }

  return (
    <AuthShell
      icon="🎓"
      title="Ingresa al Gimnasio"
      subtitle="Escribe tu número de identificación"
    >
      <form onSubmit={handleSubmit}>
        <Field
          label="Número de identificación"
          value={cedula}
          onChange={setCedula}
          placeholder="Ej: 1070464317"
          autoFocus
          required
        />
        <SubmitBtn loading={loading} text="Ingresar" />
        <div style={{ textAlign:'center', marginTop:16, fontSize:13, color:'#6b7280' }}>
          ¿No tienes cuenta?{' '}
          <span onClick={() => nav('/register')} style={{ color:'#16a34a', fontWeight:700, cursor:'pointer' }}>
            Crear cuenta
          </span>
        </div>
      </form>
      <BackBtn onClick={() => nav('/')} />
    </AuthShell>
  )
}

// ── Componentes compartidos exportados para reusar ────────────────────────
export function AuthShell({ icon, title, subtitle, children }) {
  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(135deg,#064e3b 0%,#16a34a 55%,#4ade80 100%)',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:20, fontFamily:"'DM Sans',sans-serif"
    }}>
      <div style={{ background:'#fff', borderRadius:22, padding:'36px 32px', width:'100%', maxWidth:420, boxShadow:'0 25px 70px rgba(0,0,0,.2)' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ width:64, height:64, borderRadius:18, background:'linear-gradient(135deg,#16a34a,#22c55e)', display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:14, boxShadow:'0 6px 20px rgba(22,163,74,.3)', fontSize:28 }}>{icon}</div>
          <h2 style={{ margin:'0 0 6px', fontSize:22, fontWeight:700, color:'#111' }}>{title}</h2>
          <p style={{ margin:0, fontSize:13, color:'#6b7280' }}>{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Field({ label, type='text', value, onChange, disabled, ...props }) {
  return (
    <div style={{ marginBottom:14 }}>
      {label && <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:6 }}>{label}</label>}
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} disabled={disabled} {...props}
        style={{
          width:'100%', padding:'11px 14px', fontSize:14, fontFamily:"'DM Sans',sans-serif",
          border:'1.5px solid #d1d5db', borderRadius:10, outline:'none', boxSizing:'border-box',
          background: disabled ? '#f3f4f6' : '#fafafa', color: disabled ? '#9ca3af' : '#111',
          transition:'border-color .2s'
        }}
        onFocus={e => { if(!disabled) e.target.style.borderColor='#16a34a' }}
        onBlur={e => { e.target.style.borderColor='#d1d5db' }}
      />
    </div>
  )
}

export function SubmitBtn({ loading, text }) {
  return (
    <button type="submit" disabled={loading} style={{
      width:'100%', padding:'13px', borderRadius:12, border:'none',
      background:'linear-gradient(135deg,#16a34a,#22c55e)',
      color:'#fff', fontSize:15, fontWeight:700,
      cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1,
      fontFamily:"'DM Sans',sans-serif", boxShadow:'0 4px 14px rgba(22,163,74,.3)', marginTop:4
    }}>{loading ? 'Procesando...' : text}</button>
  )
}

export function BackBtn({ onClick, label = '← Volver al inicio' }) {
  return (
    <div style={{ textAlign:'center', marginTop:20 }}>
      <button onClick={onClick} style={{ background:'none', border:'none', color:'#9ca3af', fontSize:12, cursor:'pointer', textDecoration:'underline', fontFamily:"'DM Sans',sans-serif" }}>
        {label}
      </button>
    </div>
  )
}
