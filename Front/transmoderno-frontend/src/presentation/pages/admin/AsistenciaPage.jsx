import { useState } from 'react'
import { useAsistencia, useRutas } from '../../../application/hooks'
import { Btn, Input, Select, Table, Pagination, PageHeader, TabBar, Card } from '../../components/ui/index'

export default function AsistenciaPage() {
  const a = useAsistencia()
  const r = useRutas()
  const [tab, setTab] = useState('register')
  const [form, setForm] = useState({numeroIdentificacion:'',rutaId:''})
  const [saving, setSaving] = useState(false)
  const [sesionId, setSesionId] = useState('')
  const [sesData, setSesData] = useState([])
  const [sesPage, setSesPage] = useState(0)
  const [sesTotalP, setSesTotalP] = useState(0)
  const [partId, setPartId] = useState('')
  const [partData, setPartData] = useState([])
  const [partPage, setPartPage] = useState(0)
  const [partTotalP, setPartTotalP] = useState(0)

  const registrar = async () => { setSaving(true); try { await a.registrar(form.numeroIdentificacion,parseInt(form.rutaId)); setForm({numeroIdentificacion:'',rutaId:''}) } catch {} setSaving(false) }
  const loadSes = async (id,p=0) => { try { const r=await a.listarPorSesion(id,p); setSesData(r.contenido||[]); setSesPage(r.paginaActual||0); setSesTotalP(r.totalPaginas||0) } catch {} }
  const loadPart = async (id,p=0) => { try { const r=await a.listarPorParticipante(id,p); setPartData(r.contenido||[]); setPartPage(r.paginaActual||0); setPartTotalP(r.totalPaginas||0) } catch {} }

  return <div>
    <PageHeader title="Asistencia" subtitle="Registro y consulta"/>
    <TabBar tabs={[{key:'register',label:'Registrar'},{key:'session',label:'Por sesión'},{key:'participant',label:'Por participante'}]} active={tab} onChange={setTab}/>
    {tab==='register'&&<Card style={{maxWidth:420}}><h4 style={{margin:'0 0 16px',color:'#111'}}>Registrar asistencia</h4><Input label="Nro identificación" value={form.numeroIdentificacion} onChange={e=>setForm({...form,numeroIdentificacion:e.target.value})}/><Select label="Ruta" value={form.rutaId} onChange={e=>setForm({...form,rutaId:e.target.value})} options={r.data.filter(x=>x.activa).map(x=>({value:x.id,label:x.nombre}))}/><Btn onClick={registrar} disabled={saving} style={{width:'100%'}}>{saving?'Registrando...':'Registrar'}</Btn></Card>}
    {tab==='session'&&<><div style={{display:'flex',gap:8,marginBottom:16}}><Input placeholder="ID sesión" value={sesionId} onChange={e=>setSesionId(e.target.value)} onKeyDown={e=>e.key==='Enter'&&loadSes(sesionId)} style={{marginBottom:0,flex:1}}/><Btn variant="secondary" icon="search" onClick={()=>loadSes(sesionId)}>Buscar</Btn></div><Table columns={[{key:'id',label:'ID'},{key:'participanteId',label:'Participante'},{key:'fechaHoraRegistro',label:'Fecha/Hora',render:v=>v?.replace('T',' ').substring(0,19)}]} data={sesData}/><Pagination page={sesPage} totalPages={sesTotalP} onChange={p=>loadSes(sesionId,p)}/></>}
    {tab==='participant'&&<><div style={{display:'flex',gap:8,marginBottom:16}}><Input placeholder="Nro identificación" value={partId} onChange={e=>setPartId(e.target.value)} onKeyDown={e=>e.key==='Enter'&&loadPart(partId)} style={{marginBottom:0,flex:1}}/><Btn variant="secondary" icon="search" onClick={()=>loadPart(partId)}>Buscar</Btn></div><Table columns={[{key:'id',label:'ID'},{key:'sesionId',label:'Sesión'},{key:'fechaHoraRegistro',label:'Fecha/Hora',render:v=>v?.replace('T',' ').substring(0,19)}]} data={partData}/><Pagination page={partPage} totalPages={partTotalP} onChange={p=>loadPart(partId,p)}/></>}
  </div>
}
