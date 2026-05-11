import { useNavigate } from 'react-router-dom'

export default function WelcomePage() {
  const nav = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #064e3b 0%, #16a34a 55%, #4ade80 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, fontFamily: "'DM Sans', sans-serif", position: 'relative', overflow: 'hidden'
    }}>
      {/* Decoración */}
      <div style={{ position:'absolute', top:-100, right:-100, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,255,255,.12) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-150, left:-150, width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,255,255,.08) 0%, transparent 70%)', pointerEvents:'none' }} />

      <div style={{ width:'100%', maxWidth:900, position:'relative', zIndex:1 }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:48, color:'#fff' }}>
          <div style={{
            width:88, height:88, borderRadius:24,
            background:'rgba(255,255,255,.95)',
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            marginBottom:20, boxShadow:'0 12px 40px rgba(0,0,0,.2)'
          }}>
            <span style={{ fontSize:42, fontWeight:700, fontFamily:"'Playfair Display',serif", background:'linear-gradient(135deg,#064e3b,#16a34a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>G</span>
          </div>
          <h1 style={{ fontSize:40, margin:'0 0 8px', fontWeight:700, fontFamily:"'Playfair Display',serif", letterSpacing:'-.02em' }}>
            Gimnasio Transmoderno
          </h1>
          <p style={{ fontSize:16, opacity:.85, margin:0, fontWeight:300 }}>
            Universidad de Cundinamarca · Bienestar Universitario
          </p>
        </div>

        {/* Tarjetas */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px,1fr))', gap:24 }}>
          <Card
            icon="🎓"
            tag="Participantes"
            title="Soy Estudiante"
            desc="Registra tu asistencia, completa fichas de bienestar y solicita orientación de forma discreta."
            actions={[
              { label:'Ingresar con mi cédula', primary:true, fn: () => nav('/login/estudiante') },
              { label:'Crear cuenta nueva', fn: () => nav('/register') }
            ]}
          />
          <Card
            icon="🏥"
            tag="Administración"
            title="Personal del Gimnasio"
            desc="Psicólogos, encargados y administradores — gestiona participantes, sesiones, alertas y reportes."
            actions={[
              { label:'Iniciar sesión', primary:true, fn: () => nav('/login/admin') }
            ]}
          />
        </div>

        <p style={{ textAlign:'center', marginTop:36, color:'rgba(255,255,255,.6)', fontSize:12 }}>
          Plataforma de Bienestar Universitario — UCundinamarca © 2026
        </p>
      </div>
    </div>
  )
}

function Card({ icon, tag, title, desc, actions }) {
  return (
    <div style={{
      background:'#fff', borderRadius:22, padding:'32px 28px',
      boxShadow:'0 20px 60px rgba(0,0,0,.15)',
      transition:'transform .25s, box-shadow .25s'
    }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='0 28px 70px rgba(0,0,0,.22)' }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 20px 60px rgba(0,0,0,.15)' }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
        <div style={{ width:52, height:52, borderRadius:14, background:'linear-gradient(135deg,#f0faf0,#dcfce7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26 }}>{icon}</div>
        <span style={{ fontSize:11, fontWeight:700, color:'#16a34a', textTransform:'uppercase', letterSpacing:1 }}>{tag}</span>
      </div>
      <h3 style={{ margin:'0 0 8px', fontSize:22, fontWeight:700, color:'#111' }}>{title}</h3>
      <p style={{ margin:'0 0 24px', fontSize:14, color:'#6b7280', lineHeight:1.6 }}>{desc}</p>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {actions.map((a,i) => (
          <button key={i} onClick={a.fn} style={{
            width:'100%', padding:'12px 18px', borderRadius:12,
            border: a.primary ? 'none' : '1.5px solid #d1d5db',
            background: a.primary ? 'linear-gradient(135deg,#16a34a,#22c55e)' : '#fff',
            color: a.primary ? '#fff' : '#374151',
            fontSize:14, fontWeight:700, cursor:'pointer',
            fontFamily:"'DM Sans',sans-serif",
            boxShadow: a.primary ? '0 4px 14px rgba(22,163,74,.3)' : 'none',
            transition:'all .18s'
          }}
            onMouseEnter={e => { if(a.primary) e.currentTarget.style.opacity='.9' }}
            onMouseLeave={e => { e.currentTarget.style.opacity='1' }}
          >{a.label}</button>
        ))}
      </div>
    </div>
  )
}
