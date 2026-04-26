import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../application/context/AuthContext'
import { useToast } from '../../application/context/ToastContext'
import { Btn, Input, Card } from '../components/ui/index'

export default function LoginPage() {
  const [form, setForm] = useState({ correo: '', contrasena: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const toast = useToast()
  const nav = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.correo, form.contrasena)
      nav('/admin/participantes')
    } catch (err) {
      toast(err.mensaje || 'Credenciales inválidas', 'error')
    }
    setLoading(false)
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#f0faf0,#e8f5e8)',padding:20}}>
      <Card style={{width:'100%',maxWidth:400}}>
        <div style={{textAlign:'center',marginBottom:24}}>
          <div style={{width:56,height:56,borderRadius:14,background:'linear-gradient(135deg,#16a34a,#22c55e)',display:'inline-flex',alignItems:'center',justifyContent:'center',marginBottom:12,boxShadow:'0 2px 12px rgba(22,163,74,.3)'}}>
            <span style={{color:'#fff',fontWeight:700,fontSize:22,fontFamily:"'Playfair Display',serif"}}>G</span>
          </div>
          <h2 style={{fontSize:20,fontWeight:700,color:'#111',margin:'0 0 4px'}}>Iniciar sesión</h2>
          <p style={{fontSize:14,color:'#6b7280',margin:0}}>Panel de administración</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input label="Correo electrónico" type="email" value={form.correo} onChange={e=>setForm({...form,correo:e.target.value})} placeholder="admin@ucundinamarca.edu.co" required/>
          <Input label="Contraseña" type="password" value={form.contrasena} onChange={e=>setForm({...form,contrasena:e.target.value})} placeholder="••••••" required/>
          <Btn type="submit" disabled={loading} style={{width:'100%',marginTop:8}}>{loading?'Ingresando...':'Ingresar'}</Btn>
        </form>

      </Card>
      <Btn variant="ghost" onClick={() => {
        login('admin@ucundinamarca.edu.co', 'admin123').catch(() => {})
        localStorage.setItem('tm_user', JSON.stringify({
          token: 'dev-token',
          nombre: 'Admin Dev',
          correo: 'admin@ucundinamarca.edu.co',
          rol: 'ADMIN'
        }))
        nav('/admin/participantes')
      }} style={{ width: '100%', marginTop: 8, color: '#9ca3af' }}>
        Saltar login (modo dev)
      </Btn>
    </div>
  )
}
