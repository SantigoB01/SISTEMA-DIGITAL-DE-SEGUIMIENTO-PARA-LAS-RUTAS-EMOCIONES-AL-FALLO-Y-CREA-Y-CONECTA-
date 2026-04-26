import { useState, useEffect } from 'react'
import { useSesiones, useRutas } from '../../../application/hooks'
import { Sesion } from '../../../domain/models'
import { Btn, Input, Select, Table, Pagination, PageHeader, Modal } from '../../components/ui/index'

export default function SesionesPage() {
  const s = useSesiones()
  const r = useRutas()
  const [rutaId, setRutaId] = useState('')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(Sesion.empty())
  const [saving, setSaving] = useState(false)

  useEffect(() => { if(rutaId) s.loadByRuta(rutaId) }, [rutaId])

  const save = async () => {
    setSaving(true)
    try { await s.crear({...form,rutaId:parseInt(rutaId)}); setModal(false); s.loadByRuta(rutaId) } catch {}
    setSaving(false)
  }

  const remove = async (id) => { if(!confirm('¿Eliminar?')) return; await s.eliminar(id); s.loadByRuta(rutaId) }

  return <div>
    <PageHeader title="Sesiones" subtitle="Programación por ruta" action={rutaId&&<Btn icon="plus" onClick={()=>{setForm(Sesion.empty());setModal(true)}}>Nueva</Btn>}/>
    <Select label="Ruta" value={rutaId} onChange={e=>setRutaId(e.target.value)} options={r.data.map(x=>({value:x.id,label:x.nombre}))}/>
    {rutaId&&<><Table columns={[{key:'nombre',label:'Nombre'},{key:'fecha',label:'Fecha'},{key:'horaInicio',label:'Inicio'},{key:'horaFin',label:'Fin'}]} data={s.data} actions={row=><Btn variant="danger" size="sm" icon="trash" onClick={()=>remove(row.id)}/>}/><Pagination page={s.page} totalPages={s.totalPages} onChange={p=>s.loadByRuta(rutaId,p)}/></>}
    <Modal open={modal} onClose={()=>setModal(false)} title="Nueva sesión">
      <Input label="Nombre" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})}/>
      <Input label="Fecha" type="date" value={form.fecha} onChange={e=>setForm({...form,fecha:e.target.value})}/>
      <Input label="Hora inicio" type="time" value={form.horaInicio} onChange={e=>setForm({...form,horaInicio:e.target.value})}/>
      <Input label="Hora fin" type="time" value={form.horaFin} onChange={e=>setForm({...form,horaFin:e.target.value})}/>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}><Btn variant="ghost" onClick={()=>setModal(false)}>Cancelar</Btn><Btn onClick={save} disabled={saving}>{saving?'Creando...':'Crear'}</Btn></div>
    </Modal>
  </div>
}
