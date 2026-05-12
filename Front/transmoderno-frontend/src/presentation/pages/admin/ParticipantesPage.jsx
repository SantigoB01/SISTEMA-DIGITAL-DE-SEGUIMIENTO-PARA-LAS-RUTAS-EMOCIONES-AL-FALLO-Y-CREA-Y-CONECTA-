import { useState, useEffect, useRef } from 'react'
import { useParticipantes, useRutas } from '../../../application/hooks'
import { Participante } from '../../../domain/models'
import { Btn, Input, Select, Table, Pagination, PageHeader, Modal, Badge, TabBar, Card, Spinner } from '../../components/ui/index'
import http from '../../../infrastructure/api/httpClient'
import * as XLSX from 'xlsx'

// Extrae sede corta: "UNIDAD REGIONAL, SEDE FUSAGASUGÁ" → "Fusagasugá"
const sedeCort = (s='') => s?.split(',').pop()?.trim().replace(/^(SEDE|EXTENSIÓN|EXTENSION)\s*/i,'') || s

// Campos para exportar
const EXPORT_COLS = [
  { key:'nombreCompleto',       label:'Nombre completo' },
  { key:'numeroIdentificacion', label:'Número identificación' },
  { key:'correoInstitucional',  label:'Correo institucional' },
  { key:'programaAcademico',    label:'Programa académico' },
  { key:'semestre',             label:'Semestre' },
  { key:'sede',                 label:'Sede' },
  { key:'estamento',            label:'Estamento' },
  { key:'tipoDocumento',        label:'Tipo documento' },
  { key:'fechaRegistro',        label:'Fecha registro' },
  { key:'rutaInscrita',         label:'Ruta inscrita' },
  { key:'estadoInscripcion',    label:'Estado inscripción' },
]

async function fetchPartById(id) {
  try { return await http.get(`/participantes/${id}`) } catch { return null }
}

async function cargarInscritosConDatos(rutaId) {
  const url = rutaId ? `/inscripciones?rutaId=${rutaId}&page=0&size=500` : '/inscripciones?page=0&size=500'
  const res = await http.get(url)
  const inscs = res.contenido || []

  // La inscripción devuelve numeroIdentificacion (cédula) — usarla para buscar el participante
  const uniqueCedulas = [...new Set(inscs.map(i => i.numeroIdentificacion).filter(Boolean))]

  // Endpoint real: GET /participantes/identificacion/{cedula}
  const parts = await Promise.all(uniqueCedulas.map(async cedula => {
    try { return await http.get(`/participantes/identificacion/${cedula}`) } catch { return null }
  }))

  const partMap = new Map(parts.filter(Boolean).map(p => [p.numeroIdentificacion, p]))

  return inscs.map(insc => {
    const part = partMap.get(insc.numeroIdentificacion) || {}
    return {
      ...part,
      // Asegurar que los campos de inscripción prevalezcan
      rutaId:             insc.rutaId,
      estadoInscripcion:  insc.estado,
      inscripcionId:      insc.id,
      // Fallback si el participante no tiene nombre
      _cedula:            insc.numeroIdentificacion,
    }
  })
}

export default function ParticipantesPage() {
  const p = useParticipantes()
  const r = useRutas()
  const [tab, setTab] = useState('inscritos')

  // ── Inscritos ──
  const [todos, setTodos]           = useState([])   // datos completos sin filtrar
  const [loading, setLoading]       = useState(false)
  const [filtroRuta, setFiltroRuta] = useState('')

  // Filtros de columna
  const [fPrograma, setFPrograma]   = useState('')
  const [fSemestre, setFSemestre]   = useState('')
  const [fSede, setFSede]           = useState('')
  const [fEstamento, setFEstamento] = useState('')

  // Opciones únicas derivadas de los datos
  const [optsPrograma, setOptsP]  = useState([])
  const [optsSemestre, setOptsS]  = useState([])
  const [optsSede, setOptsSd]     = useState([])
  const [optsEstamento, setOptsE] = useState([])

  // ── CRUD Todos ──
  const [modal, setModal]   = useState(false)
  const [form, setForm]     = useState(Participante.empty())
  const [saving, setSaving] = useState(false)
  const [importando, setI]  = useState(false)
  const fileRef = useRef(null)

  const rutaName = (id) => r.data.find(x => String(x.id) === String(id))?.nombre || `Ruta ${id}`

  useEffect(() => { cargar() }, [filtroRuta])

  const cargar = async () => {
    setLoading(true)
    try {
      const data = await cargarInscritosConDatos(filtroRuta)
      const enriched = data.map(d => ({
        ...d,
        rutaInscrita: rutaName(d.rutaId),
        sedeCort:     sedeCort(d.sede),
      }))
      setTodos(enriched)

      // Derivar opciones únicas
      setOptsP([...new Set(enriched.map(x=>x.programaAcademico).filter(Boolean))].sort())
      setOptsS([...new Set(enriched.map(x=>String(x.semestre||'')).filter(Boolean))].sort((a,b)=>Number(a)-Number(b)))
      setOptsSd([...new Set(enriched.map(x=>x.sedeCort).filter(Boolean))].sort())
      setOptsE([...new Set(enriched.map(x=>x.estamento).filter(Boolean))].sort())
    } catch {}
    setLoading(false)
  }

  // Aplicar filtros de columna
  const filtrados = todos.filter(row => {
    if (fPrograma && row.programaAcademico !== fPrograma) return false
    if (fSemestre && String(row.semestre) !== fSemestre) return false
    if (fSede && row.sedeCort !== fSede) return false
    if (fEstamento && row.estamento !== fEstamento) return false
    return true
  })

  const limpiarFiltros = () => { setFPrograma(''); setFSemestre(''); setFSede(''); setFEstamento('') }

  const exportar = (tipo) => {
    const data = filtrados.map(row => Object.fromEntries(EXPORT_COLS.map(c => [c.label, row[c.key] ?? ''])))
    if (tipo === 'excel') {
      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Participantes')
      XLSX.writeFile(wb, 'participantes.xlsx')
    } else {
      const header = EXPORT_COLS.map(c=>c.label).join(',')
      const rows = data.map(r => EXPORT_COLS.map(c=>`"${r[c.label]??''}"`).join(',')).join('\n')
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([header+'\n'+rows],{type:'text/csv;charset=utf-8;'}))
      a.download = 'participantes.csv'; a.click()
    }
  }

  // ── CRUD ──
  const save = async () => {
    setSaving(true)
    try { if (form.id) await p.actualizar(form.id,form); else await p.crear(form); setModal(false); setForm(Participante.empty()); p.load() } catch {}
    setSaving(false)
  }
  const remove = async (id) => { if(!confirm('¿Desactivar?')) return; await p.eliminar(id); p.load() }
  const handleImport = async (e) => {
    const file=e.target.files?.[0]; if(!file) return; setI(true)
    try { await p.importar(file); p.load() } catch {}
    setI(false); e.target.value=''
  }

  return (
    <div>
      <PageHeader title="Participantes" subtitle="Inscritos al gimnasio y directorio">
        <div style={{display:'flex',gap:8}}>
          {tab==='inscritos' && <>
            <Btn variant="ghost" size="sm" onClick={()=>exportar('csv')}>↓ CSV</Btn>
            <Btn variant="secondary" size="sm" onClick={()=>exportar('excel')}>↓ Excel</Btn>
          </>}
          {tab==='todos' && <>
            <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleImport} style={{display:'none'}}/>
            <Btn variant="ghost" size="sm" onClick={()=>fileRef.current?.click()} disabled={importando}>{importando?'Importando…':'Importar CSV'}</Btn>
            <Btn icon="plus" size="sm" onClick={()=>{setForm(Participante.empty());setModal(true)}}>Nuevo</Btn>
          </>}
        </div>
      </PageHeader>

      <TabBar
        tabs={[{key:'inscritos',label:'Inscritos al gimnasio'},{key:'todos',label:'Directorio completo'}]}
        active={tab} onChange={setTab}
      />

      {/* ── Tab inscritos ── */}
      {tab==='inscritos' && (
        <div>
          {/* Filtro por ruta */}
          <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
            {[{id:'',nombre:'Todas las rutas'},...r.data].map(rt=>(
              <button key={rt.id} onClick={()=>{setFiltroRuta(String(rt.id));limpiarFiltros()}} style={{
                padding:'7px 16px',borderRadius:10,border:'1.5px solid',cursor:'pointer',
                fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13,transition:'all .15s',
                borderColor:String(filtroRuta)===String(rt.id)?'var(--gt-primary)':'var(--gt-border)',
                background:String(filtroRuta)===String(rt.id)?'var(--gt-primary)':'#fff',
                color:String(filtroRuta)===String(rt.id)?'#fff':'var(--gt-muted)',
              }}>{rt.nombre?.includes('Fallo')?'🔥 ':rt.id?'🎨 ':''}{rt.nombre||'Todas las rutas'}</button>
            ))}
          </div>

          {/* Filtros de columna */}
          <Card style={{marginBottom:14,padding:'14px 16px',background:'var(--gt-bg)'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:10,marginBottom:8}}>
              <div>
                <label style={{fontSize:11,fontWeight:700,color:'var(--gt-muted)',display:'block',marginBottom:4}}>PROGRAMA</label>
                <select value={fPrograma} onChange={e=>setFPrograma(e.target.value)} style={{width:'100%',padding:'7px 10px',border:'1.5px solid var(--gt-border)',borderRadius:8,fontSize:13,fontFamily:"'DM Sans',sans-serif",background:'#fff',outline:'none'}}>
                  <option value="">Todos</option>
                  {optsPrograma.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:700,color:'var(--gt-muted)',display:'block',marginBottom:4}}>SEMESTRE</label>
                <select value={fSemestre} onChange={e=>setFSemestre(e.target.value)} style={{width:'100%',padding:'7px 10px',border:'1.5px solid var(--gt-border)',borderRadius:8,fontSize:13,fontFamily:"'DM Sans',sans-serif",background:'#fff',outline:'none'}}>
                  <option value="">Todos</option>
                  {optsSemestre.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:700,color:'var(--gt-muted)',display:'block',marginBottom:4}}>SEDE</label>
                <select value={fSede} onChange={e=>setFSede(e.target.value)} style={{width:'100%',padding:'7px 10px',border:'1.5px solid var(--gt-border)',borderRadius:8,fontSize:13,fontFamily:"'DM Sans',sans-serif",background:'#fff',outline:'none'}}>
                  <option value="">Todas</option>
                  {optsSede.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:11,fontWeight:700,color:'var(--gt-muted)',display:'block',marginBottom:4}}>ESTAMENTO</label>
                <select value={fEstamento} onChange={e=>setFEstamento(e.target.value)} style={{width:'100%',padding:'7px 10px',border:'1.5px solid var(--gt-border)',borderRadius:8,fontSize:13,fontFamily:"'DM Sans',sans-serif",background:'#fff',outline:'none'}}>
                  <option value="">Todos</option>
                  {optsEstamento.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <button onClick={limpiarFiltros} style={{padding:'5px 12px',border:'1px solid var(--gt-border)',borderRadius:7,background:'#fff',fontSize:12,color:'var(--gt-muted)',cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>Limpiar filtros</button>
              <span style={{fontSize:12,color:'var(--gt-muted)'}}>{filtrados.length} resultado{filtrados.length!==1?'s':''}</span>
            </div>
          </Card>

          {loading ? <Spinner /> : (
            <Table
              columns={[
                { key:'nombreCompleto',       label:'Nombre',       render:(v,row)=>v||(row._cedula?`Cédula: ${row._cedula}`:`ID: ${row.participanteId||row.id||'?'}`) },
                { key:'numeroIdentificacion', label:'Identificación', muted:true },
                { key:'programaAcademico',    label:'Programa',     render:v=>v||'—', muted:true },
                { key:'semestre',             label:'Sem.',         render:v=>v||'—', muted:true },
                { key:'sedeCort',             label:'Sede',         render:v=>v||'—', muted:true },
                { key:'rutaInscrita',         label:'Ruta',         render:v=><Badge text={v} color="var(--gt-primary)"/> },
                { key:'estadoInscripcion',    label:'Estado',       render:v=><Badge text={v||'ACTIVA'} color={v==='ACTIVA'?'#16a34a':'#9ca3af'}/> },
              ]}
              data={filtrados}
            />
          )}

          {!loading && filtrados.length===0 && (
            <div style={{textAlign:'center',padding:'40px 0',color:'var(--gt-muted)'}}>
              <p style={{fontSize:28}}>👥</p>
              <p style={{fontWeight:700}}>Sin inscritos para los filtros seleccionados</p>
            </div>
          )}
        </div>
      )}

      {/* ── Tab directorio ── */}
      {tab==='todos' && (
        <div>
          <div style={{display:'flex',gap:8,marginBottom:16}}>
            <Input placeholder="Buscar por cédula… (Enter)" style={{marginBottom:0,flex:1,maxWidth:300}}
              onKeyDown={e=>e.key==='Enter'&&p.buscar(e.target.value)}
              onChange={e=>!e.target.value&&p.load()}/>
          </div>
          <Table
            columns={[
              {key:'nombreCompleto',       label:'Nombre'},
              {key:'numeroIdentificacion', label:'Identificación', muted:true},
              {key:'correoInstitucional',  label:'Correo',         muted:true},
              {key:'programaAcademico',    label:'Programa',       muted:true},
              {key:'semestre',             label:'Sem.',           muted:true},
              {key:'activo',               label:'Estado', render:v=><Badge text={v!==false?'Activo':'Inactivo'} color={v!==false?'#16a34a':'#9ca3af'}/>},
            ]}
            data={p.data}
            actions={row=>(
              <div style={{display:'flex',gap:6}}>
                <Btn size="sm" variant="ghost" icon="edit" onClick={()=>{setForm(row);setModal(true)}}/>
                <Btn size="sm" variant="danger" icon="trash" onClick={()=>remove(row.id)}/>
              </div>
            )}
          />
          <Pagination page={p.page} totalPages={p.totalPages} onChange={p.load}/>
        </div>
      )}

      {/* Modal */}
      <Modal open={modal} onClose={()=>setModal(false)} title={form.id?'Editar participante':'Nuevo participante'}>
        <Input label="Nombre completo *" value={form.nombreCompleto||''} onChange={e=>setForm({...form,nombreCompleto:e.target.value})}/>
        <Input label="Número de identificación *" value={form.numeroIdentificacion||''} onChange={e=>setForm({...form,numeroIdentificacion:e.target.value})}/>
        <Input label="Correo institucional" type="email" value={form.correoInstitucional||''} onChange={e=>setForm({...form,correoInstitucional:e.target.value})}/>
        <Input label="Programa académico" value={form.programaAcademico||''} onChange={e=>setForm({...form,programaAcademico:e.target.value})}/>
        <Input label="Semestre" type="number" min="1" max="12" value={form.semestre||''} onChange={e=>setForm({...form,semestre:e.target.value})}/>
        <Input label="Sede" value={form.sede||''} onChange={e=>setForm({...form,sede:e.target.value})}/>
        <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:4}}>
          <Btn variant="ghost" onClick={()=>setModal(false)}>Cancelar</Btn>
          <Btn onClick={save} disabled={saving||!form.nombreCompleto?.trim()||!form.numeroIdentificacion?.trim()}>
            {saving?'Guardando…':'Guardar'}
          </Btn>
        </div>
      </Modal>
    </div>
  )
}
