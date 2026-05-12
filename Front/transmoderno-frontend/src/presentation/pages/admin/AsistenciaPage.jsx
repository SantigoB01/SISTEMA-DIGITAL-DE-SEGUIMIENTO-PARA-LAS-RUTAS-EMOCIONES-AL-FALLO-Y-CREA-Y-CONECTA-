import { useState } from 'react'
import { useRutas } from '../../../application/hooks'
import { Btn, Table, Pagination, PageHeader, TabBar, Card, Badge, Spinner } from '../../components/ui/index'
import http from '../../../infrastructure/api/httpClient'
import * as XLSX from 'xlsx'

async function buildSesionMap() {
  const map = new Map()
  try {
    const rutas = await http.get('/rutas')
    const rutaArr = Array.isArray(rutas) ? rutas : (rutas.contenido || [])
    await Promise.all(rutaArr.map(async ruta => {
      try {
        const res = await http.get(`/sesiones/ruta/${ruta.id}?page=0&size=200`)
        const seses = res.contenido || []
        seses.forEach(s => map.set(s.id, { ...s, rutaNombre: ruta.nombre, rutaId: ruta.id }))
      } catch {}
    }))
  } catch {}
  return map
}

async function enriquecerRegistros(registros, rutaIdHint) {
  if (!registros.length) return registros
  const sesMap = await buildSesionMap()
  return registros.map(reg => {
    const ses = sesMap.get(reg.sesionId) || {}
    return {
      ...reg,
      sesionNombre: reg.sesionNombre || ses.nombre || '—',
      rutaNombre:   reg.rutaNombre   || ses.rutaNombre || '—',
      sesionFecha:  reg.sesionFecha  || ses.fecha || '',
      horaInicio:   ses.horaInicio   || '',
      lugar:        ses.lugar        || '',
    }
  })
}

function exportDosHojas(sesData, sesionActual) {
  if (!sesData.length) return
  const wb = XLSX.utils.book_new()
  const h1 = sesData.map(r => ({
    'Nombre completo':     r.nombreCompleto || `ID: ${r.participanteId}`,
    'Número identificación': r.numeroIdentificacion || r.participanteId || '',
  }))
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(h1), 'Nombre y Cedula')
  const h2 = sesData.map(r => ({
    'Nombre completo':     r.nombreCompleto || `ID: ${r.participanteId}`,
    'Identificación':      r.numeroIdentificacion || '',
    'Correo':              r.correoInstitucional  || '',
    'Programa':            r.programaAcademico    || '',
    'Semestre':            r.semestre             || '',
    'Sede':                r.sede                 || '',
    'Estamento':           r.estamento            || '',
    'Fecha/Hora registro': r.fechaHoraRegistro?.replace('T',' ').substring(0,16) || '',
    'Sesión':              sesionActual?.nombre   || '',
    'Fecha sesión':        sesionActual?.fecha    || '',
  }))
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(h2), 'Datos completos')
  XLSX.writeFile(wb, `asistencia_${sesionActual?.nombre?.replace(/\s+/g,'_')||'sesion'}.xlsx`)
}

export default function AsistenciaPage() {
  const r = useRutas()
  const [tab, setTab]           = useState('sesion')
  const [rutaId, setRutaId]     = useState('')
  const [sesiones, setSesiones] = useState([])
  const [sesionId, setSesionId] = useState('')
  const [sesData, setSesData]   = useState([])
  const [sesPage, setSesPage]   = useState(0)
  const [sesTotalP, setSesTP]   = useState(0)
  const [loadingSes, setLS]     = useState(false)
  const [cedula, setCedula]     = useState('')
  const [partData, setPartData] = useState([])
  const [partPage, setPartPage] = useState(0)
  const [partTP, setPartTP]     = useState(0)
  const [loadingPart, setLP]    = useState(false)
  const [buscado, setBuscado]   = useState(false)
  const [partNombre, setPartNombre] = useState('')

  const cargarSesiones = async (rId) => {
    setRutaId(rId); setSesionId(''); setSesData([])
    try {
      const res = await http.get(`/sesiones/ruta/${rId}?page=0&size=100`)
      setSesiones(res.contenido || [])
    } catch { setSesiones([]) }
  }

  const cargarPorSesion = async (sId, pg = 0) => {
    if (!sId) return
    setLS(true)
    try {
      const res = await http.get(`/asistencia/sesion/${sId}?page=${pg}&size=20`)
      const contenido = res.contenido || []
      // Enriquecer con datos del participante vía cédulas de inscripciones
      const inscsRes = await http.get(`/inscripciones?rutaId=${rutaId}&page=0&size=500`).catch(()=>({contenido:[]}))
      const inscs = inscsRes.contenido || []
      const idACedula = new Map(inscs.map(i=>[i.participanteId, i.numeroIdentificacion]).filter(([k,v])=>k&&v))
      const cedulas = [...new Set(contenido.map(r=>idACedula.get(r.participanteId)).filter(Boolean))]
      const partsArr = await Promise.all(cedulas.map(c=>http.get(`/participantes/identificacion/${c}`).catch(()=>null)))
      const partMap = new Map(partsArr.filter(Boolean).map(p=>[p.numeroIdentificacion, p]))
      const enriched = contenido.map(reg => {
        const cedula = idACedula.get(reg.participanteId)
        const part = cedula ? (partMap.get(cedula)||{}) : {}
        return { ...reg, ...part, participanteId: reg.participanteId }
      })
      setSesData(enriched)
      setSesPage(res.paginaActual||pg); setSesTP(res.totalPaginas||0)
    } catch { setSesData([]) }
    setLS(false)
  }

  const buscarPorParticipante = async (pg = 0) => {
    if (!cedula.trim()) return
    setLP(true); setBuscado(true); setPartNombre('')
    try {
      // Obtener datos del participante
      try {
        const part = await http.get(`/participantes/identificacion/${cedula.trim()}`)
        setPartNombre(part.nombreCompleto || '')
      } catch {}

      const res = await http.get(`/asistencia/participante/${cedula.trim()}?page=${pg}&size=50`)
      const contenido = res.contenido || []

      // Enriquecer con nombres de sesión y ruta
      const enriched = await enriquecerRegistros(contenido, null)
      setPartData(enriched)
      setPartPage(res.paginaActual||pg); setPartTP(res.totalPaginas||0)
    } catch { setPartData([]) }
    setLP(false)
  }

  const sesionActual = sesiones.find(s => String(s.id) === String(sesionId))

  return (
    <div>
      <PageHeader title="Asistencia" subtitle="Consulta por sesión o por participante" />

      <TabBar
        tabs={[{ key:'sesion', label:'Por sesión' }, { key:'participante', label:'Por participante' }]}
        active={tab}
        onChange={t => { setTab(t); setSesData([]); setPartData([]); setBuscado(false); setPartNombre('') }}
      />

      {/* ── Por sesión ── */}
      {tab === 'sesion' && (
        <div>
          <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
            {r.data.map(ruta => (
              <button key={ruta.id} onClick={() => cargarSesiones(String(ruta.id))} style={{
                padding:'8px 18px', borderRadius:10, fontWeight:700, fontSize:14,
                border:'1.5px solid', cursor:'pointer', transition:'all .15s',
                fontFamily:"'DM Sans',sans-serif",
                borderColor: rutaId===String(ruta.id)?'var(--gt-primary)':'var(--gt-border)',
                background: rutaId===String(ruta.id)?'var(--gt-primary)':'#fff',
                color: rutaId===String(ruta.id)?'#fff':'var(--gt-muted)',
              }}>
                {ruta.nombre?.includes('Fallo')?'🔥':'🎨'} {ruta.nombre}
              </button>
            ))}
          </div>

          {rutaId && sesiones.length === 0 && <p style={{ color:'var(--gt-muted)', fontSize:13 }}>Esta ruta no tiene sesiones.</p>}

          {rutaId && sesiones.length > 0 && (
            <div style={{ marginBottom:16, display:'flex', gap:8 }}>
              <select value={sesionId} onChange={e => { setSesionId(e.target.value); setSesData([]) }} style={{
                flex:1, padding:'9px 13px', border:'1.5px solid var(--gt-border)', borderRadius:9,
                fontSize:14, fontFamily:"'DM Sans',sans-serif", background:'#fff', outline:'none',
              }}>
                <option value="">Selecciona una sesión…</option>
                {sesiones.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}{s.fecha?` — ${s.fecha}`:''}{s.horaInicio?` · ${s.horaInicio}`:''}
                    {s.encargado?` · 👤 ${s.encargado}`:''}
                  </option>
                ))}
              </select>
              <Btn onClick={() => cargarPorSesion(sesionId)} disabled={!sesionId||loadingSes} variant="secondary" icon="search">Ver</Btn>
            </div>
          )}

          {sesionActual && (
            <Card style={{ marginBottom:16, padding:'12px 18px', background:'var(--gt-primary-light)', display:'flex', gap:16, alignItems:'center', flexWrap:'wrap' }}>
              <div style={{ flex:1 }}>
                <p style={{ fontWeight:800, fontSize:15, color:'var(--gt-primary)', margin:0 }}>{sesionActual.nombre}</p>
                <p style={{ fontSize:12, color:'var(--gt-muted)', margin:'3px 0 0' }}>
                  {sesionActual.fecha||'—'}{sesionActual.horaInicio?` · ${sesionActual.horaInicio}`:''}
                  {sesionActual.lugar?` · 📍 ${sesionActual.lugar}`:''}
                  {sesionActual.encargado?` · 👤 ${sesionActual.encargado}`:''}
                </p>
              </div>
              <Badge text={`${sesData.length} registros`} color="var(--gt-primary)" />
              {sesData.length > 0 && (
                <div style={{ display:'flex', gap:6 }}>
                  <Btn size="sm" variant="secondary" onClick={()=>exportDosHojas(sesData, sesionActual)}>↓ Excel (2 hojas)</Btn>
                </div>
              )}
            </Card>
          )}

          {loadingSes && <Spinner />}
          {!loadingSes && sesData.length > 0 && (
            <>
              <Table
                columns={[
                  { key:'nombreCompleto',       label:'Nombre completo', render:(v,row)=> v||(row.numeroIdentificacion?`Cédula: ${row.numeroIdentificacion}`:`ID: ${row.participanteId}`) },
                  { key:'numeroIdentificacion', label:'Identificación',  muted:true },
                  { key:'programaAcademico',    label:'Programa',        render:v=>v||'—', muted:true },
                  { key:'semestre',             label:'Sem.',            render:v=>v||'—', muted:true },
                  { key:'fechaHoraRegistro',    label:'Registrado',      render:v=>v?.replace('T',' ').substring(0,16)||'—', muted:true },
                ]}
                data={sesData}
              />
              <Pagination page={sesPage} totalPages={sesTotalP} onChange={pg=>cargarPorSesion(sesionId, pg)} />
            </>
          )}
          {!loadingSes && sesionId && sesData.length === 0 && (
            <div style={{ textAlign:'center', padding:'40px 0', color:'var(--gt-muted)' }}>
              <p style={{ fontSize:28 }}>📋</p><p style={{ fontWeight:700 }}>Nadie ha registrado asistencia en esta sesión</p>
            </div>
          )}
        </div>
      )}

      {/* ── Por participante ── */}
      {tab === 'participante' && (
        <div>
          <Card style={{ maxWidth:540, marginBottom:20 }}>
            <p style={{ fontWeight:700, fontSize:15, color:'var(--gt-text)', marginBottom:12 }}>Historial por participante</p>
            <div style={{ display:'flex', gap:8 }}>
              <input placeholder="Número de identificación (cédula)"
                value={cedula} onChange={e=>setCedula(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&buscarPorParticipante()}
                style={{ flex:1, padding:'9px 13px', border:'1.5px solid var(--gt-border)', borderRadius:9, fontSize:14, fontFamily:"'DM Sans',sans-serif", outline:'none' }}
                onFocus={e=>{e.target.style.borderColor='var(--gt-primary)'}}
                onBlur={e=>{e.target.style.borderColor='var(--gt-border)'}}/>
              <Btn icon="search" onClick={()=>buscarPorParticipante()} disabled={!cedula.trim()||loadingPart}>
                {loadingPart?'…':'Buscar'}
              </Btn>
            </div>
          </Card>

          {loadingPart && <Spinner />}

          {!loadingPart && buscado && (
            <>
              {partNombre && (
                <div style={{ marginBottom:12, display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:36,height:36,borderRadius:'50%',background:'var(--gt-primary)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:14 }}>
                    {partNombre.split(' ').slice(0,2).map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <p style={{ fontWeight:700,fontSize:15,color:'var(--gt-text)',margin:0 }}>{partNombre}</p>
                    <p style={{ fontSize:12,color:'var(--gt-muted)',margin:0 }}>Cédula: {cedula}</p>
                  </div>
                  <Badge text={`${partData.length} asistencias`} color="var(--gt-primary)" style={{ marginLeft:'auto' }}/>
                </div>
              )}

              {partData.length === 0 ? (
                <div style={{ textAlign:'center', padding:'40px 0', color:'var(--gt-muted)' }}>
                  <p style={{ fontSize:28 }}>🔍</p>
                  <p style={{ fontWeight:700 }}>Sin registros de asistencia</p>
                </div>
              ) : (
                <Table
                  columns={[
                    { key:'sesionNombre', label:'Sesión',      render:v=>v||'—' },
                    { key:'rutaNombre',   label:'Ruta',        render:v=>v||'—' },
                    { key:'sesionFecha',  label:'Fecha sesión', render:v=>v||'—', muted:true },
                    { key:'fechaHoraRegistro', label:'Registrado', render:v=>v?.replace('T',' ').substring(0,16)||'—', muted:true },
                  ]}
                  data={partData}
                />
              )}
              <Pagination page={partPage} totalPages={partTP} onChange={pg=>buscarPorParticipante(pg)} />
            </>
          )}
        </div>
      )}
    </div>
  )
}
