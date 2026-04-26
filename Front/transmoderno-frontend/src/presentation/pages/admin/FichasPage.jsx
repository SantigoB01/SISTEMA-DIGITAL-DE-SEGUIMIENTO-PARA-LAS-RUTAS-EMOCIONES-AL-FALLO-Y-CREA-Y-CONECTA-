import { useState, useEffect } from 'react'
import { usePreguntas, useFichas, useRutas } from '../../../application/hooks'
import { Pregunta } from '../../../domain/models'
import { Btn, Input, Textarea, Select, Table, PageHeader, Modal, Badge, TabBar, Card } from '../../components/ui/index'

export default function FichasPage() {
  const r = useRutas()
  const preg = usePreguntas()
  const fichas = useFichas()
  const [rutaId, setRutaId] = useState('')
  const [tab, setTab] = useState('preguntas')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(Pregunta.empty())
  const [saving, setSaving] = useState(false)
  const [fichaForm, setFichaForm] = useState({inscripcionId:'',fichaPreId:'',respuestas:[]})
  const [fichaResult, setFichaResult] = useState(null)

  useEffect(() => { preg.loadByRuta(rutaId) }, [rutaId])

  const savePregunta = async () => {
    setSaving(true)
    try {
      form.id ? await preg.actualizar(form.id, {texto:form.texto,orden:form.orden}) : await preg.crear({...form,rutaId:parseInt(rutaId)})
      setModal(false); preg.loadByRuta(rutaId)
    } catch {}
    setSaving(false)
  }

  const setResp = (pid, v) => setFichaForm(f => ({...f, respuestas: [...f.respuestas.filter(r=>r.preguntaId!==pid), {preguntaId:pid,valor:parseInt(v)}]}))

  const submitPre = async () => { setSaving(true); try { const r = await fichas.crearPre({inscripcionId:parseInt(fichaForm.inscripcionId),respuestas:fichaForm.respuestas}); setFichaResult(r) } catch {} setSaving(false) }
  const submitPost = async () => { setSaving(true); try { const r = await fichas.crearPost({fichaPreId:parseInt(fichaForm.fichaPreId),respuestas:fichaForm.respuestas}); setFichaResult(r) } catch {} setSaving(false) }
  const lookupPre = async () => { try { setFichaResult(await fichas.obtenerPre(fichaForm.inscripcionId)) } catch {} }
  const lookupPost = async () => { try { setFichaResult(await fichas.obtenerPost(fichaForm.fichaPreId)) } catch {} }

  return <div>
    <PageHeader title="Fichas" subtitle="Preguntas y fichas PRE/POST"/>
    <TabBar tabs={[{key:'preguntas',label:'Preguntas'},{key:'pre',label:'Ficha PRE'},{key:'post',label:'Ficha POST'},{key:'consultar',label:'Consultar'}]} active={tab} onChange={t=>{setTab(t);setFichaResult(null);setFichaForm({inscripcionId:'',fichaPreId:'',respuestas:[]})}}/>

    {tab==='preguntas'&&<>
      <div style={{display:'flex',gap:8,marginBottom:16,alignItems:'flex-end'}}>
        <div style={{flex:1}}><Select label="Ruta" value={rutaId} onChange={e=>setRutaId(e.target.value)} options={r.data.map(x=>({value:x.id,label:x.nombre}))}/></div>
        {rutaId&&<Btn icon="plus" onClick={()=>{setForm({...Pregunta.empty(),orden:preg.data.length+1});setModal(true)}} style={{marginBottom:16}}>Nueva</Btn>}
      </div>
      <Table columns={[{key:'orden',label:'#'},{key:'texto',label:'Pregunta'},{key:'activa',label:'Estado',render:v=><Badge text={v?'Activa':'Inactiva'} color={v?'#16a34a':'#6b7280'}/>}]} data={preg.data} actions={row=><div style={{display:'flex',gap:4,justifyContent:'flex-end'}}><Btn variant="ghost" size="sm" icon="edit" onClick={()=>{setForm(row);setModal(true)}}/>{row.activa&&<Btn variant="ghost" size="sm" icon="trash" onClick={()=>{preg.desactivar(row.id);preg.loadByRuta(rutaId)}}/>}</div>}/>
    </>}

    {(tab==='pre'||tab==='post')&&<Card style={{maxWidth:560}}>
      <h4 style={{margin:'0 0 16px'}}>Diligenciar ficha {tab.toUpperCase()}</h4>
      {tab==='pre'&&<><Input label="ID inscripción" value={fichaForm.inscripcionId} onChange={e=>setFichaForm({...fichaForm,inscripcionId:e.target.value})}/><Select label="Ruta" value={rutaId} onChange={e=>setRutaId(e.target.value)} options={r.data.map(x=>({value:x.id,label:x.nombre}))}/></>}
      {tab==='post'&&<><Input label="ID ficha PRE" value={fichaForm.fichaPreId} onChange={e=>setFichaForm({...fichaForm,fichaPreId:e.target.value})}/><Select label="Ruta" value={rutaId} onChange={e=>setRutaId(e.target.value)} options={r.data.map(x=>({value:x.id,label:x.nombre}))}/></>}
      {preg.data.filter(p=>p.activa).map(p=><div key={p.id} style={{marginBottom:16,padding:14,background:'#f9fef9',borderRadius:10,border:'1px solid #e8ece8'}}>
        <div style={{fontSize:14,fontWeight:600,color:'#374151',marginBottom:8}}>{p.orden}. {p.texto}</div>
        <div style={{display:'flex',gap:8}}>{[1,2,3,4,5].map(v=>{const sel=fichaForm.respuestas.find(r=>r.preguntaId===p.id)?.valor===v; return <button key={v} onClick={()=>setResp(p.id,v)} style={{width:40,height:40,borderRadius:10,border:sel?'2px solid #16a34a':'1.5px solid #d1d5db',background:sel?'#16a34a':'#fff',color:sel?'#fff':'#374151',fontWeight:700,fontSize:16,transition:'all .15s'}}>{v}</button>})}</div>
      </div>)}
      <Btn onClick={tab==='pre'?submitPre:submitPost} disabled={saving} style={{width:'100%',marginTop:8}}>{saving?'Enviando...':`Enviar ${tab.toUpperCase()}`}</Btn>
    </Card>}

    {tab==='consultar'&&<Card style={{maxWidth:560}}>
      <h4 style={{margin:'0 0 16px'}}>Consultar fichas</h4>
      <div style={{display:'flex',gap:8,marginBottom:12}}><Input placeholder="ID inscripción" value={fichaForm.inscripcionId} onChange={e=>setFichaForm({...fichaForm,inscripcionId:e.target.value})} style={{marginBottom:0,flex:1}}/><Btn variant="secondary" size="sm" onClick={lookupPre}>PRE</Btn></div>
      <div style={{display:'flex',gap:8,marginBottom:12}}><Input placeholder="ID ficha PRE" value={fichaForm.fichaPreId} onChange={e=>setFichaForm({...fichaForm,fichaPreId:e.target.value})} style={{marginBottom:0,flex:1}}/><Btn variant="secondary" size="sm" onClick={lookupPost}>POST</Btn></div>
      {fichaResult&&<div style={{marginTop:16,padding:16,background:'#f0faf0',borderRadius:10}}>
        <div style={{fontSize:13,color:'#6b7280',marginBottom:8}}>Ficha #{fichaResult.id} — {fichaResult.completada?'Completada':'Pendiente'}</div>
        {fichaResult.respuestas?.map(r=><div key={r.id} style={{display:'flex',justifyContent:'space-between',padding:'4px 0',fontSize:14,borderBottom:'1px solid #e8ece8'}}><span>Pregunta {r.preguntaId}</span><span style={{fontWeight:700,color:'#16a34a'}}>{r.valor}/5</span></div>)}
      </div>}
    </Card>}

    <Modal open={modal} onClose={()=>setModal(false)} title={form.id?'Editar':'Nueva pregunta'}>
      <Textarea label="Texto" value={form.texto} onChange={e=>setForm({...form,texto:e.target.value})}/>
      <Input label="Orden" type="number" value={form.orden} onChange={e=>setForm({...form,orden:parseInt(e.target.value)||''})}/>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}><Btn variant="ghost" onClick={()=>setModal(false)}>Cancelar</Btn><Btn onClick={savePregunta} disabled={saving}>{saving?'Guardando...':'Guardar'}</Btn></div>
    </Modal>
  </div>
}
