import { useState } from 'react'
import { useInscripciones, useRutas } from '../../../application/hooks'
import { Btn, Input, Select, Table, Pagination, PageHeader, Modal, Badge, TabBar } from '../../components/ui/index'

export default function InscripcionesPage() {
  const ins = useInscripciones()
  const r = useRutas()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({numeroIdentificacion:'',rutaId:''})
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('all')
  const [searchId, setSearchId] = useState('')
  const [searchRes, setSearchRes] = useState([])

  const inscribir = async () => { setSaving(true); try { await ins.inscribir(form.numeroIdentificacion, parseInt(form.rutaId)); setModal(false) } catch {} setSaving(false) }
  const buscar = async () => { if(!searchId.trim()) return; try { setSearchRes(await ins.buscarPorParticipante(searchId)) } catch { setSearchRes([]) } }
  const rutaName = (id) => r.data.find(x=>x.id===id)?.nombre || id

  return <div>
    <PageHeader title="Inscripciones" subtitle="Inscripciones a rutas" action={<Btn icon="plus" onClick={()=>{setForm({numeroIdentificacion:'',rutaId:''});setModal(true)}}>Inscribir</Btn>}/>
    <TabBar tabs={[{key:'all',label:'Todas'},{key:'search',label:'Por participante'}]} active={tab} onChange={setTab}/>
    {tab==='all'&&<><Table columns={[{key:'id',label:'ID'},{key:'participanteId',label:'Participante'},{key:'rutaId',label:'Ruta',render:v=>rutaName(v)},{key:'fechaInscripcion',label:'Fecha',render:v=>v?.split('T')[0]},{key:'estado',label:'Estado',render:v=><Badge text={v} color={v==='ACTIVA'?'#16a34a':'#6b7280'}/>}]} data={ins.data} actions={row=>row.estado==='ACTIVA'&&<Btn variant="ghost" size="sm" onClick={()=>confirm('¿Finalizar?')&&ins.finalizar(row.id)}>Finalizar</Btn>}/><Pagination page={ins.page} totalPages={ins.totalPages} onChange={p=>ins.load(p)}/></>}
    {tab==='search'&&<><div style={{display:'flex',gap:8,marginBottom:16}}><Input placeholder="Nro identificación" value={searchId} onChange={e=>setSearchId(e.target.value)} onKeyDown={e=>e.key==='Enter'&&buscar()} style={{marginBottom:0,flex:1}}/><Btn variant="secondary" icon="search" onClick={buscar}>Buscar</Btn></div><Table columns={[{key:'id',label:'ID'},{key:'rutaId',label:'Ruta',render:v=>rutaName(v)},{key:'fechaInscripcion',label:'Fecha',render:v=>v?.split('T')[0]},{key:'estado',label:'Estado',render:v=><Badge text={v} color={v==='ACTIVA'?'#16a34a':'#6b7280'}/>}]} data={searchRes}/></>}
    <Modal open={modal} onClose={()=>setModal(false)} title="Nueva inscripción">
      <Input label="Nro identificación" value={form.numeroIdentificacion} onChange={e=>setForm({...form,numeroIdentificacion:e.target.value})}/>
      <Select label="Ruta" value={form.rutaId} onChange={e=>setForm({...form,rutaId:e.target.value})} options={r.data.filter(x=>x.activa).map(x=>({value:x.id,label:x.nombre}))}/>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}><Btn variant="ghost" onClick={()=>setModal(false)}>Cancelar</Btn><Btn onClick={inscribir} disabled={saving}>{saving?'Inscribiendo...':'Inscribir'}</Btn></div>
    </Modal>
  </div>
}
