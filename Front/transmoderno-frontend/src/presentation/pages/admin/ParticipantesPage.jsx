import { useState } from 'react'
import { useParticipantes } from '../../../application/hooks'
import { Participante } from '../../../domain/models'
import { Btn, Input, Table, Pagination, PageHeader, Modal, Badge } from '../../components/ui/index'

export default function ParticipantesPage() {
  const p = useParticipantes()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(Participante.empty())
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)

  const openNew = () => { setForm(Participante.empty()); setModal(true) }
  const openEdit = (row) => { setForm({...row}); setModal(true) }

  const save = async () => {
    setSaving(true)
    try { form.id ? await p.actualizar(form.id, form) : await p.registrar(form) ; setModal(false) } catch {}
    setSaving(false)
  }

  const doSearch = () => { search.trim() ? p.buscar(search) : p.load() }

  return <div>
    <PageHeader title="Participantes" subtitle="Gestión de participantes del gimnasio" action={<Btn icon="plus" onClick={openNew}>Nuevo</Btn>}/>
    <div style={{display:'flex',gap:8,marginBottom:20}}>
      <Input placeholder="Buscar por identificación..." value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doSearch()} style={{marginBottom:0,flex:1}}/>
      <Btn variant="secondary" icon="search" onClick={doSearch}>Buscar</Btn>
      {search&&<Btn variant="ghost" onClick={()=>{setSearch('');p.load()}}>Limpiar</Btn>}
    </div>
    <Table columns={[
      {key:'numeroIdentificacion',label:'Identificación'},
      {key:'nombreCompleto',label:'Nombre'},
      {key:'correoInstitucional',label:'Correo'},
      {key:'programaAcademico',label:'Programa'},
      {key:'semestre',label:'Sem.'},
      {key:'activo',label:'Estado',render:v=><Badge text={v?'Activo':'Inactivo'} color={v?'#16a34a':'#dc2626'}/>}
    ]} data={p.data} actions={row=><div style={{display:'flex',gap:4,justifyContent:'flex-end'}}>
      <Btn variant="ghost" size="sm" icon="edit" onClick={()=>openEdit(row)}/>
      {row.activo&&<Btn variant="ghost" size="sm" icon="trash" onClick={()=>confirm('¿Desactivar?')&&p.desactivar(row.id)}/>}
    </div>}/>
    <Pagination page={p.page} totalPages={p.totalPages} onChange={pg=>p.load(pg)}/>
    <Modal open={modal} onClose={()=>setModal(false)} title={form.id?'Editar':'Nuevo participante'}>
      <Input label="Identificación" value={form.numeroIdentificacion} onChange={e=>setForm({...form,numeroIdentificacion:e.target.value})}/>
      <Input label="Nombre completo" value={form.nombreCompleto} onChange={e=>setForm({...form,nombreCompleto:e.target.value})}/>
      <Input label="Correo institucional" type="email" value={form.correoInstitucional} onChange={e=>setForm({...form,correoInstitucional:e.target.value})}/>
      <Input label="Programa académico" value={form.programaAcademico} onChange={e=>setForm({...form,programaAcademico:e.target.value})}/>
      <Input label="Semestre" type="number" min="1" max="10" value={form.semestre} onChange={e=>setForm({...form,semestre:parseInt(e.target.value)||''})}/>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:8}}>
        <Btn variant="ghost" onClick={()=>setModal(false)}>Cancelar</Btn>
        <Btn onClick={save} disabled={saving}>{saving?'Guardando...':'Guardar'}</Btn>
      </div>
    </Modal>
  </div>
}
