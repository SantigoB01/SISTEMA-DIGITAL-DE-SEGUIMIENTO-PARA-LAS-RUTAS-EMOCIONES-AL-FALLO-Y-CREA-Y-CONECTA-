import { useState } from 'react'
import { useReportes, useRutas } from '../../../application/hooks'
import { Btn, Input, Select, Table, PageHeader, TabBar, StatCard, Card } from '../../components/ui/index'

export default function ReportesPage() {
  const rep = useReportes()
  const r = useRutas()
  const [rutaId, setRutaId] = useState('')
  const [tab, setTab] = useState('sesiones')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [sesData, setSesData] = useState([])
  const [rutaData, setRutaData] = useState(null)
  const [compData, setCompData] = useState(null)

  const loadSes = async () => { if(!rutaId) return; try { setSesData(await rep.asistenciaSesiones(rutaId,desde,hasta)) } catch {} }
  const loadRuta = async () => { if(!rutaId) return; try { setRutaData(await rep.asistenciaRuta(rutaId)) } catch {} }
  const loadComp = async () => { if(!rutaId) return; try { setCompData(await rep.comparativo(rutaId)) } catch {} }

  return <div>
    <PageHeader title="Reportes" subtitle="Reportes de asistencia y bienestar"/>
    <Select label="Ruta" value={rutaId} onChange={e=>setRutaId(e.target.value)} options={r.data.map(x=>({value:x.id,label:x.nombre}))}/>
    <TabBar tabs={[{key:'sesiones',label:'Por sesión'},{key:'ruta',label:'General'},{key:'comparativo',label:'PRE vs POST'}]} active={tab} onChange={setTab}/>
    {tab==='sesiones'&&<><div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}><Input label="Desde" type="date" value={desde} onChange={e=>setDesde(e.target.value)} style={{marginBottom:0}}/><Input label="Hasta" type="date" value={hasta} onChange={e=>setHasta(e.target.value)} style={{marginBottom:0}}/><Btn variant="secondary" onClick={loadSes} style={{alignSelf:'flex-end'}}>Consultar</Btn></div><Table columns={[{key:'nombreSesion',label:'Sesión'},{key:'fecha',label:'Fecha'},{key:'totalAsistentes',label:'Asist.'},{key:'totalInscritos',label:'Inscritos'},{key:'porcentajeAsistencia',label:'%',render:v=>`${(v*100).toFixed(1)}%`}]} data={sesData}/></>}
    {tab==='ruta'&&<><Btn variant="secondary" onClick={loadRuta} style={{marginBottom:16}}>Consultar</Btn>{rutaData&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:16}}><StatCard label="Sesiones" value={rutaData.totalSesiones} icon="calendar"/><StatCard label="Inscritos" value={rutaData.totalInscritos} icon="users"/><StatCard label="Registros" value={rutaData.totalRegistrosAsistencia} icon="check"/><StatCard label="Prom/sesión" value={rutaData.promedioAsistenciaPorSesion?.toFixed(1)} icon="chart"/></div>}</>}
    {tab==='comparativo'&&<><Btn variant="secondary" onClick={loadComp} style={{marginBottom:16}}>Consultar</Btn>{compData&&<Card><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:20}}><div style={{textAlign:'center'}}><div style={{fontSize:12,color:'#6b7280'}}>PRE</div><div style={{fontSize:28,fontWeight:700,color:'#f59e0b'}}>{compData.promedioGeneralPre?.toFixed(2)}</div></div><div style={{textAlign:'center'}}><div style={{fontSize:12,color:'#6b7280'}}>POST</div><div style={{fontSize:28,fontWeight:700,color:'#16a34a'}}>{compData.promedioGeneralPost?.toFixed(2)}</div></div><div style={{textAlign:'center'}}><div style={{fontSize:12,color:'#6b7280'}}>Diferencia</div><div style={{fontSize:28,fontWeight:700,color:compData.diferenciaGeneral>=0?'#16a34a':'#dc2626'}}>{compData.diferenciaGeneral>=0?'+':''}{compData.diferenciaGeneral?.toFixed(2)}</div></div></div><Table columns={[{key:'ordenPregunta',label:'#'},{key:'textoPregunta',label:'Pregunta'},{key:'promedioPre',label:'PRE',render:v=>v?.toFixed(2)},{key:'promedioPost',label:'POST',render:v=>v?.toFixed(2)},{key:'diferencia',label:'Δ',render:v=><span style={{color:v>=0?'#16a34a':'#dc2626',fontWeight:700}}>{v>=0?'+':''}{v?.toFixed(2)}</span>}]} data={compData.porPregunta||[]}/></Card>}</>}
  </div>
}
