import { Outlet, useNavigate } from 'react-router-dom'

export default function StudentLayout() {
  const nav = useNavigate()

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(180deg,#f0faf0 0%,#f5f8f5 100%)'}}>
      <header style={{background:'#fff',borderBottom:'1px solid #e8ece8',padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#16a34a,#22c55e)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span style={{color:'#fff',fontWeight:700,fontSize:16,fontFamily:"'Playfair Display',serif"}}>G</span>
          </div>
          <div>
            <div style={{fontWeight:700,fontSize:15,color:'#111'}}>Gimnasio Transmoderno</div>
            <div style={{fontSize:11,color:'#9ca3af'}}>UCundinamarca · Fusagasugá</div>
          </div>
        </div>
        <button onClick={()=>nav('/')} style={{padding:'6px 14px',borderRadius:8,border:'1px solid #d1d5db',background:'#fff',fontSize:13,color:'#6b7280',fontWeight:500}}>Cambiar usuario</button>
      </header>
      <main style={{maxWidth:560,margin:'0 auto',padding:'24px 16px'}}>
        <Outlet/>
      </main>
    </div>
  )
}
