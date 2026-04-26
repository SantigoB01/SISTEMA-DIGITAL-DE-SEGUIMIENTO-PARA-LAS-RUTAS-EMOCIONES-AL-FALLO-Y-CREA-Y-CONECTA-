import { useState } from 'react'
import { useUsuarios } from '../../../application/hooks'
import { Usuario } from '../../../domain/models'
import { Btn, Input, Select, Table, PageHeader, Modal, Badge } from '../../components/ui/index'

export default function UsuariosPage() {
  const u = useUsuarios()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(Usuario.empty())
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      if(form.id) await u.actualizar(form.id,{nombre:form.nombre,correo:form.correo,rol:form.rol})
      else await u.registrar(form)
      setModal(false)
    } catch {}
    setSaving(false)
  }

  return <div>
    <PageHeader title="Usuarios" subtitle="Gestión de usuarios del sistema" action={<Btn icon="plus" onClick={()=>{setForm(Usuario.empty());setModal(true)}}>Nuevo</Btn>}/>
    <Table columns={[
      {key:'nombre',label:'Nombre'},
      {key:'correo',label:'Correo'},
      {key:'rol',label:'Rol',render:v=><Badge text={v} color={v==='ADMIN'?'#7c3aed':v==='PSICOLOGO'?'#0891b2':'#16a34a'}/>},
      {key:'activo',label:'Estado',render:v=><Badge text={v?'Activo':'Inactivo'} color={v?'#16a34a':'#dc2626'}/>},
      {key:'fechaCreacion',label:'Creado',render:v=>v?.split('T')[0]}
    ]} data={u.data} actions={row=><div style={{display:'flex',gap:4,justifyContent:'flex-end'}}>
      <Btn variant="ghost" size="sm" icon="edit" onClick={()=>{setForm(row);setModal(true)}}/>
      {row.activo&&<Btn variant="ghost" size="sm" icon="trash" onClick={()=>confirm('¿Desactivar?')&&u.desactivar(row.id)}/>}
    </div>}/>
    <Modal open={modal} onClose={()=>setModal(false)} title={form.id?'Editar':'Nuevo usuario'}>
      <Input label="Nombre" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})}/>
      <Input label="Correo" type="email" value={form.correo} onChange={e=>setForm({...form,correo:e.target.value})}/>
      {!form.id&&<Input label="Contraseña" type="password" value={form.contrasena} onChange={e=>setForm({...form,contrasena:e.target.value})}/>}
      <Select label="Rol" value={form.rol} onChange={e=>setForm({...form,rol:e.target.value})} options={Usuario.roles}/>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}><Btn variant="ghost" onClick={()=>setModal(false)}>Cancelar</Btn><Btn onClick={save} disabled={saving}>{saving?'Guardando...':'Guardar'}</Btn></div>
    </Modal>
  </div>
}
