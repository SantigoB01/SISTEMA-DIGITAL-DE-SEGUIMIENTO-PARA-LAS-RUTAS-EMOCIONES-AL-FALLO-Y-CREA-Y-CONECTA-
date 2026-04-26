import { useState } from 'react'
import { useRutas } from '../../../application/hooks'
import { Ruta } from '../../../domain/models'
import { Btn, Input, Textarea, Card, PageHeader, Modal, Badge } from '../../components/ui/index'

export default function RutasPage() {
  const r = useRutas()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(Ruta.empty())
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try { form.id ? await r.actualizar(form.id, {nombre:form.nombre,descripcion:form.descripcion}) : await r.crear(form); setModal(false) } catch {}
    setSaving(false)
  }

  const toggle = (ruta) => ruta.activa ? r.desactivar(ruta.id) : r.reactivar(ruta.id)

  return <div>
    <PageHeader title="Rutas" subtitle="Rutas de actividades" action={<Btn icon="plus" onClick={()=>{setForm(Ruta.empty());setModal(true)}}>Nueva</Btn>}/>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:16}}>
      {r.data.map(rt=><Card key={rt.id}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
          <h4 style={{margin:0,fontSize:16,fontWeight:700}}>{rt.nombre}</h4>
          <Badge text={rt.activa?'Activa':'Inactiva'} color={rt.activa?'#16a34a':'#dc2626'}/>
        </div>
        <p style={{fontSize:14,color:'#6b7280',margin:'0 0 16px'}}>{rt.descripcion||'Sin descripción'}</p>
        <div style={{display:'flex',gap:8}}>
          <Btn variant="secondary" size="sm" icon="edit" onClick={()=>{setForm(rt);setModal(true)}}>Editar</Btn>
          <Btn variant={rt.activa?'danger':'primary'} size="sm" onClick={()=>toggle(rt)}>{rt.activa?'Desactivar':'Reactivar'}</Btn>
        </div>
      </Card>)}
    </div>
    <Modal open={modal} onClose={()=>setModal(false)} title={form.id?'Editar':'Nueva ruta'}>
      <Input label="Nombre" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})}/>
      <Textarea label="Descripción" value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})}/>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}><Btn variant="ghost" onClick={()=>setModal(false)}>Cancelar</Btn><Btn onClick={save} disabled={saving}>{saving?'Guardando...':'Guardar'}</Btn></div>
    </Modal>
  </div>
}
