import { useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import { Card } from '../components/ui/index'

export default function LandingPage() {
  const nav = useNavigate()

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#f0faf0,#e8f5e8)',padding:20}}>
      <div style={{textAlign:'center',maxWidth:520}}>
        <div style={{width:72,height:72,borderRadius:18,background:'linear-gradient(135deg,#16a34a,#22c55e)',display:'inline-flex',alignItems:'center',justifyContent:'center',marginBottom:20,boxShadow:'0 4px 20px rgba(22,163,74,.3)'}}>
          <span style={{color:'#fff',fontWeight:700,fontSize:32,fontFamily:"'Playfair Display',serif"}}>G</span>
        </div>
        <h1 style={{fontSize:28,fontWeight:700,color:'#111',margin:'0 0 4px'}}>Gimnasio Transmoderno</h1>
        <p style={{fontSize:14,color:'#6b7280',margin:'0 0 32px'}}>UCundinamarca · Fusagasugá</p>

        <div style={{display:'flex',gap:16,flexWrap:'wrap',justifyContent:'center'}}>
          <Card onClick={()=>nav('/student/enter')} style={{width:220,cursor:'pointer',textAlign:'center',transition:'transform .2s',border:'2px solid transparent'}}
            onMouseEnter={e=>e.currentTarget.style.borderColor='#16a34a'} onMouseLeave={e=>e.currentTarget.style.borderColor='transparent'}>
            <div style={{width:48,height:48,borderRadius:12,background:'#f0faf0',display:'inline-flex',alignItems:'center',justifyContent:'center',marginBottom:12}}>
              <Icon name="users" size={24} color="#16a34a"/>
            </div>
            <h3 style={{fontSize:16,fontWeight:700,color:'#111',margin:'0 0 4px'}}>Soy Participante</h3>
            <p style={{fontSize:13,color:'#6b7280',margin:0}}>Registra asistencia, fichas y más</p>
          </Card>

          <Card onClick={()=>nav('/login')} style={{width:220,cursor:'pointer',textAlign:'center',transition:'transform .2s',border:'2px solid transparent'}}
            onMouseEnter={e=>e.currentTarget.style.borderColor='#16a34a'} onMouseLeave={e=>e.currentTarget.style.borderColor='transparent'}>
            <div style={{width:48,height:48,borderRadius:12,background:'#f0faf0',display:'inline-flex',alignItems:'center',justifyContent:'center',marginBottom:12}}>
              <Icon name="shield" size={24} color="#16a34a"/>
            </div>
            <h3 style={{fontSize:16,fontWeight:700,color:'#111',margin:'0 0 4px'}}>Administración</h3>
            <p style={{fontSize:13,color:'#6b7280',margin:0}}>Panel de gestión del gimnasio</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
