import { useState, useEffect, useCallback } from 'react'
import { useReportes, useRutas } from '../../../application/hooks'
import { Input, Select, Spinner } from '../../components/ui/index'
import * as XLSX from 'xlsx'
import http from '../../../infrastructure/api/httpClient'

const GREEN='#0D5C2F', GREEN2='#16A34A', GRAY='#CBD5C0', AMBER='#f59e0b', BLUE='#06b6d4', PURPLE='#8b5cf6', RED='#dc2626', ORANGE='#f97316'
const PAL=[GREEN2,AMBER,BLUE,PURPLE,ORANGE,'#ec4899','#14b8a6']

// ── Gráfica barras verticales ────────────────────────────────────────────────
function BarV({ data, lk='etiqueta', vk='total', pct=false, h=200 }) {
  if (!data?.length) return <Empty/>
  const max=Math.max(...data.map(d=>Number(d[vk])||0))||1
  const W=420,H=h,PAD={t:30,r:8,b:60,l:36}
  const cW=W-PAD.l-PAD.r,cH=H-PAD.t-PAD.b,bW=Math.min(44,cW/data.length-6)
  return(
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%'}}>
      {[0,.25,.5,.75,1].map((t,i)=>{const y=PAD.t+cH-t*cH;return(<g key={i}>
        <line x1={PAD.l} x2={PAD.l+cW} y1={y} y2={y} stroke="#F0F4F0" strokeWidth={1}/>
        <text x={PAD.l-4} y={y+4} textAnchor="end" fontSize={9} fill="#9CA3AF" fontFamily="DM Sans">{pct?`${Math.round(max*t)}%`:Math.round(max*t)}</text>
      </g>)})}
      {data.map((d,i)=>{
        const val=Number(d[vk])||0,x=PAD.l+(cW/data.length)*i+(cW/data.length-bW)/2
        const bH=(val/max)*cH,y=PAD.t+cH-bH,lbl=String(d[lk]||'').slice(0,12)
        return(<g key={i}>
          <rect x={x} y={y} width={bW} height={bH} fill={PAL[i%PAL.length]} rx={5} opacity={.92}/>
          <text x={x+bW/2} y={y-5} textAnchor="middle" fontSize={10} fill="#374151" fontFamily="DM Sans" fontWeight="700">{pct?`${val}%`:val}</text>
          <text x={x+bW/2} y={PAD.t+cH+16} textAnchor="middle" fontSize={8.5} fill="#6B7280" fontFamily="DM Sans"
            transform={`rotate(-35,${x+bW/2},${PAD.t+cH+16})`}>{lbl}</text>
        </g>)
      })}
      <line x1={PAD.l} x2={PAD.l+cW} y1={PAD.t+cH} y2={PAD.t+cH} stroke="#D1D5DB"/>
    </svg>
  )
}

// ── Donut ────────────────────────────────────────────────────────────────────
function Donut({ data, lk='etiqueta', vk='total' }) {
  if (!data?.length) return <Empty/>
  const total=data.reduce((s,d)=>s+(Number(d[vk])||0),0)||1
  const R=72,CX=100,CY=90; let ang=-Math.PI/2
  const sl=data.map((d,i)=>{const val=Number(d[vk])||0,sw=(val/total)*2*Math.PI,x1=CX+R*Math.cos(ang),y1=CY+R*Math.sin(ang);ang+=sw;return{x1,y1,x2:CX+R*Math.cos(ang),y2:CY+R*Math.sin(ang),sw,val,label:d[lk],color:PAL[i%PAL.length],pct:((val/total)*100).toFixed(0)}})
  return(
    <div style={{display:'flex',gap:16,alignItems:'center'}}>
      <svg viewBox="0 0 200 180" style={{width:160,flexShrink:0}}>
        {sl.map((s,i)=><path key={i} d={`M${CX},${CY} L${s.x1},${s.y1} A${R},${R} 0 ${s.sw>Math.PI?1:0},1 ${s.x2},${s.y2} Z`} fill={s.color} stroke="#fff" strokeWidth={2.5} opacity={.9}/>)}
        <circle cx={CX} cy={CY} r={40} fill="white"/>
        <text x={CX} y={CY-5} textAnchor="middle" fontSize={16} fill="#111" fontFamily="DM Sans" fontWeight="800">{total}</text>
        <text x={CX} y={CY+12} textAnchor="middle" fontSize={10} fill="#9CA3AF" fontFamily="DM Sans">total</text>
      </svg>
      <div style={{flex:1}}>
        {sl.map((s,i)=><div key={i} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
          <div style={{width:12,height:12,borderRadius:3,background:s.color,flexShrink:0}}/>
          <div style={{flex:1}}>
            <span style={{fontSize:13,fontWeight:700,color:'#111'}}>{s.val}</span>
            <span style={{fontSize:12,color:'#6B7280',marginLeft:6}}>{s.label}</span>
          </div>
          <span style={{fontSize:12,fontWeight:700,color:s.color}}>{s.pct}%</span>
        </div>)}
      </div>
    </div>
  )
}

// ── Línea ────────────────────────────────────────────────────────────────────
function LineChart({ data, lk='semana', vk='total', color=GREEN }) {
  if (!data?.length) return <Empty/>
  const max=Math.max(...data.map(d=>Number(d[vk])||0))||1
  const W=860,H=170,PAD={t:20,r:12,b:48,l:40},n=data.length
  const cW=W-PAD.l-PAD.r,cH=H-PAD.t-PAD.b
  const pts=data.map((d,i)=>({x:PAD.l+(i/Math.max(n-1,1))*cW,y:PAD.t+cH-(Number(d[vk])/max)*cH,v:Number(d[vk]),l:String(d[lk]||'').slice(0,10)}))
  const path=pts.map((p,i)=>`${i===0?'M':'L'}${p.x},${p.y}`).join(' ')
  return(
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%'}}>
      <defs><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".15"/><stop offset="100%" stopColor={color} stopOpacity=".01"/></linearGradient></defs>
      {[0,.5,1].map((t,i)=>{const y=PAD.t+cH-t*cH;return(<g key={i}><line x1={PAD.l} x2={PAD.l+cW} y1={y} y2={y} stroke="#F0F4F0"/><text x={PAD.l-4} y={y+4} textAnchor="end" fontSize={9} fill="#9CA3AF" fontFamily="DM Sans">{Math.round(max*t)}</text></g>)})}
      <path d={`${path} L${pts[n-1].x},${PAD.t+cH} L${pts[0].x},${PAD.t+cH} Z`} fill="url(#gg)"/>
      <path d={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p,i)=>(<g key={i}>
        <circle cx={p.x} cy={p.y} r={4} fill={color} stroke="#fff" strokeWidth={2}/>
        <text x={p.x} y={p.y-8} textAnchor="middle" fontSize={9} fill="#374151" fontFamily="DM Sans" fontWeight="700">{p.v}</text>
        {(n<=10||i%Math.ceil(n/8)===0)&&<text x={p.x} y={PAD.t+cH+16} textAnchor="middle" fontSize={8} fill="#9CA3AF" fontFamily="DM Sans" transform={`rotate(-30,${p.x},${PAD.t+cH+16})`}>{p.l}</text>}
      </g>))}
    </svg>
  )
}

// ── PRE vs POST horizontal ────────────────────────────────────────────────────
function PrePostH({ data }) {
  if (!data?.length) return <Empty/>
  const max5=5
  return(
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      {data.slice(0,6).map((d,i)=>{
        const pre=d.promedioPre||0, post=d.promedioPost||0, dif=post-pre
        const lbl=(d.pregunta||`P${i+1}`).replace(/^¿/,'').replace(/\?$/,'').slice(0,28)
        return(
          <div key={i}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
              <span style={{fontSize:12,fontWeight:700,color:'#374151'}}>{lbl}</span>
              <span style={{fontSize:12,fontWeight:800,color:dif>=0?GREEN2:RED}}>{dif>=0?'↑':'↓'}{Math.abs(dif).toFixed(1)}</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:3}}>
              <span style={{fontSize:10,color:'#9CA3AF',width:30}}>PRE</span>
              <div style={{flex:1,height:8,background:'#F0F4F0',borderRadius:4,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${(pre/max5)*100}%`,background:GRAY,borderRadius:4}}/>
              </div>
              <span style={{fontSize:10,fontWeight:700,color:'#6B7280',width:24}}>{pre.toFixed(1)}</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <span style={{fontSize:10,color:'#9CA3AF',width:30}}>POST</span>
              <div style={{flex:1,height:8,background:'#F0F4F0',borderRadius:4,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${(post/max5)*100}%`,background:GREEN,borderRadius:4,transition:'width .5s'}}/>
              </div>
              <span style={{fontSize:10,fontWeight:700,color:GREEN,width:24}}>{post.toFixed(1)}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Alertas por nivel ────────────────────────────────────────────────────────
function AlertasBars({ data }) {
  const niveles=[
    {key:'ALTO',           label:'Crítica',      color:RED},
    {key:'MODERADO',       label:'Media',         color:ORANGE},
    {key:'LEVE',           label:'Leve',          color:AMBER},
    {key:'SIN_ASISTENCIA', label:'Sin asistencia',color:PURPLE},
  ]
  const counts={}
  data.forEach(d=>{counts[d.nivelRiesgo]=(counts[d.nivelRiesgo]||0)+1})
  const max=Math.max(...Object.values(counts),1)
  return(
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      {niveles.map(n=>{
        const val=counts[n.key]||0
        return(
          <div key={n.key} style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:12,fontWeight:700,color:'#374151',width:80,flexShrink:0}}>{n.label}</span>
            <div style={{flex:1,height:12,background:'#F0F4F0',borderRadius:6,overflow:'hidden'}}>
              <div style={{height:'100%',width:`${(val/max)*100}%`,background:n.color,borderRadius:6,transition:'width .5s'}}/>
            </div>
            <span style={{fontSize:14,fontWeight:800,color:n.color,width:24,textAlign:'right'}}>{val}</span>
          </div>
        )
      })}
    </div>
  )
}

function Empty({text='Sin datos'}) { return <div style={{textAlign:'center',padding:'28px 0',color:'#9CA3AF',fontSize:13}}>{text}</div> }

// ── Panel del dashboard ───────────────────────────────────────────────────────
function Panel({ title, sub, children, span=1 }) {
  return(
    <div style={{background:'#fff',borderRadius:16,padding:'20px',border:'1px solid #E5EDE5',boxShadow:'0 1px 4px rgba(0,0,0,.06)',gridColumn:`span ${span}`}}>
      <div style={{marginBottom:14}}>
        <h4 style={{fontWeight:800,fontSize:14,color:'#111',margin:0}}>{title}</h4>
        {sub&&<p style={{fontSize:11,color:'#9CA3AF',margin:'3px 0 0'}}>{sub}</p>}
      </div>
      {children}
    </div>
  )
}

// ── KPI ──────────────────────────────────────────────────────────────────────
function KPI({ label, value, icon, color=GREEN, trend }) {
  return(
    <div style={{background:'#fff',borderRadius:14,padding:'16px 20px',border:'1px solid #E5EDE5',display:'flex',alignItems:'center',gap:14}}>
      <div style={{width:44,height:44,borderRadius:12,background:`${color}18`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{icon}</div>
      <div>
        <p style={{fontSize:10,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:1.5,margin:'0 0 4px'}}>{label}</p>
        <p style={{fontSize:26,fontWeight:800,color,margin:0,lineHeight:1}}>{value??'—'}</p>
        {trend&&<p style={{fontSize:11,color:GREEN2,margin:'3px 0 0'}}>▲ {trend}</p>}
      </div>
    </div>
  )
}

// ── Export helpers ────────────────────────────────────────────────────────────
function exportXLSX(data, cols, name) {
  if (!data?.length) return
  try {
    const ws=XLSX.utils.json_to_sheet(data.map(r=>Object.fromEntries(cols.map(c=>[c.label,r[c.key]??'']))))
    const wb=XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb,ws,name.slice(0,31))
    XLSX.writeFile(wb,`${name}.xlsx`)
  } catch(e){console.error(e)}
}

async function fetchAllParts(rutaId) {
  try {
    const inscsRes=await http.get(rutaId?`/inscripciones?rutaId=${rutaId}&page=0&size=500`:'/inscripciones?page=0&size=500')
    const inscs=inscsRes.contenido||[]
    const cedulas=[...new Set(inscs.map(i=>i.numeroIdentificacion).filter(Boolean))]
    const parts=await Promise.all(cedulas.map(c=>http.get(`/participantes/identificacion/${c}`).catch(()=>null)))
    const partMap=new Map(parts.filter(Boolean).map(p=>[p.numeroIdentificacion,p]))
    return inscs.map(i=>({...(partMap.get(i.numeroIdentificacion)||{}),rutaInscrita:i.rutaId,estado:i.estado}))
  } catch { return [] }
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function ReportesPage() {
  const rep=useReportes()
  const r=useRutas()

  // Filtros
  const [rutaId,setRutaId]=useState('')
  const [desde,setDesde]=useState('')
  const [hasta,setHasta]=useState('')

  // Datos del dashboard
  const [fichas,setFichas]=useState([])
  const [alertas,setAlertas]=useState([])
  const [asistRuta,setAsistRuta]=useState([])
  const [tendencia,setTend]=useState([])
  const [retencion,setRet]=useState([])
  const [loadingDB,setLDB]=useState(true)

  // KPIs
  const [kpi,setKpi]=useState({participantes:0,sesiones:0,tasaAsist:null,mejora:null})

  // Drill-down
  const [drillTab,setDrill]=useState('asist')
  const [drillData,setDD]=useState([])
  const [drillLoading,setDL]=useState(false)
  const [drillConsulted,setDC]=useState(false)
  const [programa,setProg]=useState('')
  const [semestre,setSem]=useState('')

  useEffect(()=>{ loadDashboard() },[])

  const loadDashboard=async()=>{
    setLDB(true)
    try {
      const [fR,aR,asR,tR,retR]=await Promise.allSettled([
        rep.comparativaFichas(null,null),
        http.get('/alertas/inasistencia?page=0&size=100').catch(()=>({contenido:[]})),
        rep.asistenciaPorRuta(null,null,null,null,null),
        rep.tendenciaSemanal(null,null,null),
        rep.retencion(),
      ])
      const fData=fR.status==='fulfilled'?fR.value||[]:[]
      const aData=aR.status==='fulfilled'?(aR.value?.contenido||aR.value||[]):[]
      const asData=asR.status==='fulfilled'?asR.value||[]:[]
      const tData=tR.status==='fulfilled'?tR.value||[]:[]
      const retData=retR.status==='fulfilled'?retR.value||[]:[]

      setFichas(fData); setAlertas(aData); setAsistRuta(asData); setTend(tData); setRet(retData)

      const totalI=retData.reduce((s,d)=>s+(d.totalInscritos||0),0)
      const totalA=retData.reduce((s,d)=>s+(d.activos||0),0)
      const mejora=fData.length>0?(fData.reduce((s,d)=>s+((d.promedioPost||0)-(d.promedioPre||0)),0)/fData.length).toFixed(1):null

      let pCount=0, sCount=0
      try { const pR=await http.get('/participantes?page=0&size=1'); pCount=pR.totalElementos||0 } catch {}
      if(r.data.length>0) {
        const sArr=await Promise.all(r.data.filter(rt=>rt.activa).map(rt=>http.get(`/sesiones/ruta/${rt.id}?page=0&size=1`).catch(()=>({totalElementos:0}))))
        sCount=sArr.reduce((a,x)=>a+(x.totalElementos||0),0)
      }

      setKpi({ participantes:pCount, sesiones:sCount, tasaAsist:totalI>0?Math.round((totalA/totalI)*100):null, mejora })
    } catch {}
    setLDB(false)
  }

  const aplicarFiltros=async()=>{
    loadDashboard() // re-cargar con filtros (si el back los soporta)
  }

  const drillConsultar=async()=>{
    setDL(true); setDD([]); setDC(false)
    try {
      let res
      const rId=rutaId||null,d=desde||null,h=hasta||null,prog=programa||null,sem=semestre?parseInt(semestre):null
      if(drillTab==='asist')  res=await rep.asistenciaPorRuta(rId,d,h,prog,sem)
      if(drillTab==='prog')   res=await rep.asistenciaPorPrograma(rId,d,h,sem)
      if(drillTab==='sem')    res=await rep.asistenciaPorSemestre(rId,d,h,prog)
      if(drillTab==='tend')   res=await rep.tendenciaSemanal(rId,d,h)
      if(drillTab==='pRuta')  res=await rep.participantesPorRuta()
      if(drillTab==='pProg')  res=await rep.participantesPorPrograma(rId,sem)
      if(drillTab==='pSem')   res=await rep.participantesPorSemestre(rId,prog)
      if(drillTab==='fichas') res=await rep.comparativaFichas(rId,prog)
      if(drillTab==='ret')    res=await rep.retencion()
      setDD(res||[]); setDC(true)
    } catch {}
    setDL(false)
  }

  const ciclo=new Date().toLocaleDateString('es-CO',{month:'long',year:'numeric'})

  return(
    <div style={{fontFamily:"'DM Sans',sans-serif"}}>

      {/* ── Header + filtros ── */}
      <div className="no-print" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:20,flexWrap:'wrap',gap:12}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:800,color:'var(--gt-text)',margin:'0 0 3px'}}>Tablero de reportes</h1>
          <p style={{fontSize:13,color:'var(--gt-muted)',margin:0,textTransform:'capitalize'}}>Ciclo {ciclo}</p>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'flex-end',flexWrap:'wrap'}}>
          <div style={{display:'flex',flexDirection:'column',gap:4}}>
            <label style={{fontSize:11,fontWeight:700,color:'var(--gt-muted)'}}>RUTA</label>
            <select value={rutaId} onChange={e=>setRutaId(e.target.value)} style={{padding:'7px 12px',border:'1.5px solid var(--gt-border)',borderRadius:9,fontSize:13,fontFamily:"'DM Sans',sans-serif",background:'#fff',outline:'none'}}>
              <option value="">Todas las rutas</option>
              {r.data.map(x=><option key={x.id} value={x.id}>{x.nombre}</option>)}
            </select>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:4}}>
            <label style={{fontSize:11,fontWeight:700,color:'var(--gt-muted)'}}>DESDE</label>
            <input type="date" value={desde} onChange={e=>setDesde(e.target.value)} style={{padding:'7px 12px',border:'1.5px solid var(--gt-border)',borderRadius:9,fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:'none'}}/>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:4}}>
            <label style={{fontSize:11,fontWeight:700,color:'var(--gt-muted)'}}>HASTA</label>
            <input type="date" value={hasta} onChange={e=>setHasta(e.target.value)} style={{padding:'7px 12px',border:'1.5px solid var(--gt-border)',borderRadius:9,fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:'none'}}/>
          </div>
          <button onClick={loadDashboard} style={{padding:'8px 18px',background:GREEN,color:'#fff',border:'none',borderRadius:10,fontWeight:700,fontSize:13,cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>Actualizar</button>
          <button onClick={()=>window.print()} style={{padding:'8px 14px',background:'#fff',color:GREEN,border:`1.5px solid ${GREEN}`,borderRadius:10,fontWeight:700,fontSize:13,cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>↓ PDF</button>
        </div>
      </div>

      {loadingDB ? <Spinner /> : (<>

      {/* ── KPIs ── */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12,marginBottom:20}}>
        <KPI label="Participantes"   value={kpi.participantes}                              icon="👥" color={GREEN}  />
        <KPI label="Sesiones"        value={kpi.sesiones}                                   icon="📅" color={BLUE}   />
        <KPI label="Tasa asistencia" value={kpi.tasaAsist!==null?`${kpi.tasaAsist}%`:'—'}  icon="✅" color={GREEN2} />
        <KPI label="Mejora PRE→POST" value={kpi.mejora!==null?`+${kpi.mejora}`:' —'}       icon="📈" color={PURPLE} />
        <KPI label="Alertas activas" value={alertas.length}                                 icon="🔔" color={ORANGE} />
      </div>

      {/* ── Fila 1: Asistencia por sesión + Distribución por ruta ── */}
      <div style={{display:'grid',gridTemplateColumns:'3fr 2fr',gap:14,marginBottom:14}}>
        <div className="print-chart" style={{background:'#fff',borderRadius:16,padding:'20px',border:'1px solid #E5EDE5'}}>
          <h4 style={{fontWeight:800,fontSize:14,color:'#111',margin:'0 0 4px'}}>Asistencia por ruta</h4>
          <p style={{fontSize:11,color:'#9CA3AF',margin:'0 0 14px'}}>Total de registros por módulo</p>
          <BarV data={asistRuta} lk="etiqueta" vk="total"/>
        </div>
        <div className="print-chart" style={{background:'#fff',borderRadius:16,padding:'20px',border:'1px solid #E5EDE5'}}>
          <h4 style={{fontWeight:800,fontSize:14,color:'#111',margin:'0 0 4px'}}>Distribución por ruta</h4>
          <p style={{fontSize:11,color:'#9CA3AF',margin:'0 0 14px'}}>Participantes activos por módulo</p>
          <Donut data={retencion.map(d=>({etiqueta:d.ruta||'Ruta',total:d.activos||0}))}/>
        </div>
      </div>

      {/* ── Fila 2: PRE vs POST + Alertas ── */}
      <div style={{display:'grid',gridTemplateColumns:'3fr 2fr',gap:14,marginBottom:14}}>
        <div className="print-chart" style={{background:'#fff',borderRadius:16,padding:'20px',border:'1px solid #E5EDE5'}}>
          <h4 style={{fontWeight:800,fontSize:14,color:'#111',margin:'0 0 4px'}}>Comparativo PRE vs POST</h4>
          <p style={{fontSize:11,color:'#9CA3AF',margin:'0 0 16px'}}>Promedio de respuestas por pregunta (escala 1–5)</p>
          <PrePostH data={fichas}/>
        </div>
        <div className="print-chart" style={{background:'#fff',borderRadius:16,padding:'20px',border:'1px solid #E5EDE5'}}>
          <h4 style={{fontWeight:800,fontSize:14,color:'#111',margin:'0 0 4px'}}>Niveles de alerta (inasistencia)</h4>
          <p style={{fontSize:11,color:'#9CA3AF',margin:'0 0 16px'}}>Distribución por gravedad del riesgo</p>
          {alertas.length===0?<Empty text="Sin alertas registradas"/>:<AlertasBars data={alertas}/>}
        </div>
      </div>

      {/* ── Fila 3: Tendencia mensual ── */}
      {tendencia.length>0&&(
        <div className="print-chart" style={{background:'#fff',borderRadius:16,padding:'20px',border:'1px solid #E5EDE5',marginBottom:14}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
            <h4 style={{fontWeight:800,fontSize:14,color:'#111',margin:0}}>Tendencia mensual de asistencia</h4>
            <span style={{fontSize:11,color:'#9CA3AF'}}>últimos periodos</span>
          </div>
          <LineChart data={tendencia} lk="semana" vk="total"/>
        </div>
      )}

      {/* ── Separador: reportes detallados ── */}
      <div className="no-print" style={{borderTop:'2px solid var(--gt-border)',margin:'10px 0 20px',position:'relative'}}>
        <span style={{position:'absolute',top:-10,left:'50%',transform:'translateX(-50%)',background:'var(--gt-bg)',padding:'0 14px',fontSize:11,fontWeight:700,color:'var(--gt-muted)',textTransform:'uppercase',letterSpacing:1}}>Análisis detallado</span>
      </div>

      {/* ── Drill-down ── */}
      <div className="no-print" style={{background:'#fff',borderRadius:16,padding:'20px',border:'1px solid #E5EDE5'}}>
        {/* Sub-tabs */}
        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:16}}>
          {[
            {key:'asist',label:'Asistencia / ruta'},{key:'prog',label:'Asistencia / programa'},{key:'sem',label:'Asistencia / semestre'},
            {key:'tend',label:'Tendencia'},{key:'pRuta',label:'Participantes / ruta'},{key:'pProg',label:'Participantes / programa'},
            {key:'pSem',label:'Participantes / semestre'},{key:'fichas',label:'PRE vs POST'},{key:'ret',label:'Retención'},
          ].map(t=>(
            <button key={t.key} onClick={()=>{setDrill(t.key);setDD([]);setDC(false)}} style={{
              padding:'6px 12px',borderRadius:7,border:`1.5px solid ${drillTab===t.key?GREEN:'var(--gt-border)'}`,
              fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:'pointer',transition:'all .15s',
              background:drillTab===t.key?'var(--gt-primary-light)':'#fff',
              color:drillTab===t.key?GREEN:'var(--gt-muted)',
            }}>{t.label}</button>
          ))}
        </div>

        {/* Filtros del drill */}
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:14,alignItems:'flex-end'}}>
          {!['pRuta','ret'].includes(drillTab)&&<>
            {['asist','prog','sem','tend','pProg','pSem','fichas'].includes(drillTab)&&(
              <div>
                <label style={{fontSize:11,fontWeight:700,color:'var(--gt-muted)',display:'block',marginBottom:4}}>PROGRAMA</label>
                <input value={programa} onChange={e=>setProg(e.target.value)} placeholder="Ej: Ingeniería" style={{padding:'7px 10px',border:'1.5px solid var(--gt-border)',borderRadius:8,fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:'none'}}/>
              </div>
            )}
            {['asist','prog','pProg'].includes(drillTab)&&(
              <div>
                <label style={{fontSize:11,fontWeight:700,color:'var(--gt-muted)',display:'block',marginBottom:4}}>SEMESTRE</label>
                <input type="number" min="1" max="12" value={semestre} onChange={e=>setSem(e.target.value)} placeholder="1-12" style={{padding:'7px 10px',border:'1.5px solid var(--gt-border)',borderRadius:8,fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:'none',width:80}}/>
              </div>
            )}
          </>}
          <button onClick={drillConsultar} disabled={drillLoading} style={{padding:'8px 20px',background:GREEN,color:'#fff',border:'none',borderRadius:9,fontWeight:700,fontSize:13,cursor:'pointer',fontFamily:"'DM Sans',sans-serif",opacity:drillLoading?.7:1}}>
            {drillLoading?'Consultando…':'Consultar'}
          </button>
          {drillConsulted&&drillData.length>0&&(
            <button onClick={()=>exportXLSX(drillData,[{key:'etiqueta',label:'Etiqueta'},{key:'total',label:'Total'},{key:'promedioPre',label:'PRE'},{key:'promedioPost',label:'POST'}],drillTab)} style={{padding:'8px 14px',background:'#fff',color:'#374151',border:'1.5px solid var(--gt-border)',borderRadius:9,fontWeight:700,fontSize:13,cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>{'↓ Excel reporte'}</button>
          )}
          <button onClick={async()=>{const p=await fetchAllParts(rutaId);exportXLSX(p,[{key:'nombreCompleto',label:'Nombre'},{key:'numeroIdentificacion',label:'Cedula'},{key:'correoInstitucional',label:'Correo'},{key:'programaAcademico',label:'Programa'},{key:'semestre',label:'Semestre'},{key:'sede',label:'Sede'},{key:'estamento',label:'Estamento'}],'participantes_filtrados')}} style={{padding:'8px 14px',background:GREEN,color:'#fff',border:'none',borderRadius:9,fontWeight:700,fontSize:13,cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>{'↓ Excel participantes'}</button>
        </div>

        {drillLoading&&<Spinner/>}
        {drillConsulted&&!drillLoading&&drillData.length>0&&(
          <BarV data={drillData} lk={drillData[0]?.semana!==undefined?'semana':'etiqueta'} h={200}/>
        )}
        {drillConsulted&&!drillLoading&&drillData.length===0&&<Empty text="Sin datos para los filtros seleccionados"/>}
      </div>

      </>)}
    </div>
  )
}
