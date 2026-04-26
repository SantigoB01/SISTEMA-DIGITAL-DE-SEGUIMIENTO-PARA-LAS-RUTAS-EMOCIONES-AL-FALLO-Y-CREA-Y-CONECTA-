import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../../application/context/ToastContext'
import { participanteRepo } from '../../../infrastructure/repositories'
import { Btn, Input, Card } from '../../components/ui/index'
import Icon from '../../components/ui/Icon'

export default function StudentEnterPage() {
  const [numero, setNumero] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const nav = useNavigate()

  const enter = async (e) => {
    e.preventDefault()
    if (!numero.trim()) return
    setLoading(true)
    try {
      const p = await participanteRepo.findByIdentificacion(numero.trim())
      if (!p.activo) { toast('Tu cuenta está desactivada. Contacta al administrador.', 'error'); setLoading(false); return }
      localStorage.setItem('tm_student', JSON.stringify(p))
      nav('/student/home')
    } catch {
      toast('No se encontró un participante con esa identificación', 'error')
    }
    setLoading(false)
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#f0faf0,#e8f5e8)',padding:20}}>
      <Card style={{width:'100%',maxWidth:400,textAlign:'center'}}>
        <div style={{width:56,height:56,borderRadius:14,background:'linear-gradient(135deg,#16a34a,#22c55e)',display:'inline-flex',alignItems:'center',justifyContent:'center',marginBottom:12,boxShadow:'0 2px 12px rgba(22,163,74,.3)'}}>
          <span style={{color:'#fff',fontWeight:700,fontSize:22,fontFamily:"'Playfair Display',serif"}}>G</span>
        </div>
        <h2 style={{fontSize:20,fontWeight:700,color:'#111',margin:'0 0 4px'}}>Gimnasio Transmoderno</h2>
        <p style={{fontSize:14,color:'#6b7280',margin:'0 0 24px'}}>UCundinamarca · Fusagasugá</p>

        <form onSubmit={enter}>
          <Input label="Tu número de identificación" value={numero} onChange={e=>setNumero(e.target.value)} placeholder="Ej: 1234567890" required/>
          <Btn type="submit" disabled={loading} style={{width:'100%'}}>{loading?'Buscando...':'Ingresar'}</Btn>
        </form>

        <div style={{marginTop:20}}>
          <button onClick={()=>nav('/')} style={{background:'none',border:'none',color:'#6b7280',fontSize:13,textDecoration:'underline'}}>Volver al inicio</button>
        </div>
      </Card>
      <Btn variant="ghost" onClick={() => {
        localStorage.setItem('tm_student', JSON.stringify({
          id: 1,
          numeroIdentificacion: '1234567890',
          nombreCompleto: 'Estudiante Dev',
          programaAcademico: 'Ingeniería',
          semestre: 4,
          activo: true
        }))
        nav('/student/home')
      }} style={{ width: '100%', marginTop: 8, color: '#9ca3af' }}>
        Entrar como estudiante de prueba
      </Btn>
    </div>
  )
}
