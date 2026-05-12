import { useState, useEffect } from 'react'
import { useRutas } from '../../../application/hooks'
import { Sesion } from '../../../domain/models'
import { Btn, Input, PageHeader, Modal, Badge, Card } from '../../components/ui/index'
import http from '../../../infrastructure/api/httpClient'
import * as XLSX from 'xlsx'

const META = {
  'Emociones al Fallo': { icon:'🔥', color:'#FEF3DC', colorText:'#92400E', border:'#FDE68A' },
  'Crea y Conecta':     { icon:'🎨', color:'#EDE9FE', colorText:'#5B21B6', border:'#C4B5FD' },
}
const getMeta = (n='') => Object.entries(META).find(([k])=>n?.toLowerCase().includes(k.split(' ')[0].toLowerCase()))?.[1]
                          || { icon:'📌', color:'#F0F4F1', colorText:'#374151', border:'#D4E2D8' }

export default function RutasPage() {
  const r = useRutas()
  const [stats, setStats]         = useState({})
  const [sesiones, setSesiones]   = useState({})    // rutaId → sesiones[]
  const [expanded, setExpanded]   = useState({})    // rutaId → bool
  const [modal, setModal]         = useState(false)
  const [formRuta, setFormRuta]   = useState(null)   // ruta being edited
  const [descEdit, setDescEdit]   = useState('')
  const [modalSes, setModalSes]   = useState(false)
  const [formSes, setFormSes]     = useState(Sesion.empty())
  const [saving, setSaving]       = useState(false)

  useEffect(() => {
    if (r.data.length > 0) {
      fetchStats()
      r.data.forEach(ruta => fetchSesiones(ruta.id))
    }
  }, [r.data])

  const fetchStats = async () => {
    const result = {}
    await Promise.all(r.data.map(async ruta => {
      try {
        const [inscs, seses] = await Promise.all([
          http.get(`/inscripciones?rutaId=${ruta.id}&page=0&size=1`).catch(()=>({totalElementos:0})),
          http.get(`/sesiones/ruta/${ruta.id}?page=0&size=1`).catch(()=>({totalElementos:0})),
        ])
        result[ruta.id] = { participantes: inscs.totalElementos||0, sesiones: seses.totalElementos||0 }
      } catch { result[ruta.id] = { participantes:0, sesiones:0 } }
    }))
    setStats(result)
  }

  const fetchSesiones = async (rutaId) => {
    try {
      const res = await http.get(`/sesiones/ruta/${rutaId}?page=0&size=50`)
      setSesiones(prev => ({ ...prev, [rutaId]: res.contenido || [] }))
    } catch { setSesiones(prev => ({ ...prev, [rutaId]: [] })) }
  }

  const guardarDesc = async () => {
    if (!formRuta) return; setSaving(true)
    try { await r.actualizar(formRuta.id, { nombre: formRuta.nombre, descripcion: descEdit }); setModal(false) } catch {}
    setSaving(false)
  }

  const abrirNuevaSesion = (rutaId) => {
    setFormSes({ ...Sesion.empty(), rutaId: parseInt(rutaId) }); setModalSes(true)
  }
  const abrirEditarSesion = (ses, rutaId) => {
    setFormSes({ ...ses, rutaId: parseInt(rutaId) }); setModalSes(true)
  }

  const guardarSesion = async () => {
    if (!formSes.nombre?.trim() || !formSes.fecha) return; setSaving(true)
    try {
      if (formSes.id) await http.put(`/sesiones/${formSes.id}`, formSes)
      else await http.post('/sesiones', formSes)
      setModalSes(false); fetchSesiones(formSes.rutaId); fetchStats()
    } catch {}
    setSaving(false)
  }

  const eliminarSesion = async (sesId, rutaId) => {
    if (!confirm('¿Eliminar esta sesión?')) return
    try { await http.del(`/sesiones/${sesId}`); fetchSesiones(rutaId); fetchStats() } catch {}
  }

  return (
    <div>
      <PageHeader title="Rutas y Sesiones" subtitle="Módulos preestablecidos · gestión de sesiones" />

      {r.data.length === 0 && (
        <Card style={{ textAlign:'center', padding:'40px 20px' }}>
          <p style={{ fontSize:32, marginBottom:8 }}>📭</p>
          <p style={{ fontWeight:700, fontSize:16 }}>No se encontraron rutas</p>
          <pre style={{ background:'var(--gt-bg)', borderRadius:10, padding:'14px', textAlign:'left', fontSize:12, color:'var(--gt-muted)', marginTop:14, overflowX:'auto' }}>
{`INSERT INTO rutas (nombre, descripcion, activa) VALUES
('Emociones al Fallo', 'Regulación emocional', true),
('Crea y Conecta', 'Creatividad y vínculos', true);`}
          </pre>
        </Card>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
        {r.data.map(ruta => {
          const meta = getMeta(ruta.nombre)
          const st   = stats[ruta.id] || { participantes:'…', sesiones:'…' }
          const ses  = sesiones[ruta.id] || []
          const open = expanded[ruta.id]

          return (
            <div key={ruta.id} style={{ background:'#fff', borderRadius:16, border:`1.5px solid ${meta.border}`, overflow:'hidden', boxShadow:'var(--gt-shadow-sm)' }}>

              {/* ── Cabecera de ruta ── */}
              <div style={{ background:meta.color, padding:'18px 22px', display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:50, height:50, borderRadius:12, background:'rgba(255,255,255,.55)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>{meta.icon}</div>
                <div style={{ flex:1 }}>
                  <h3 style={{ fontWeight:800, fontSize:18, color:meta.colorText, margin:'0 0 3px' }}>{ruta.nombre}</h3>
                  <p style={{ fontSize:12, color:meta.colorText, opacity:.7, margin:0 }}>{ruta.descripcion || 'Sin descripción'}</p>
                </div>
                <Btn size="sm" variant="ghost" icon="edit" onClick={()=>{ setFormRuta(ruta); setDescEdit(ruta.descripcion||''); setModal(true) }}
                  style={{ background:'rgba(255,255,255,.4)', border:'none' }}>Editar</Btn>
              </div>

              {/* ── Stats ── */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderBottom:'1px solid var(--gt-border)' }}>
                {[{label:'Participantes inscritos', value:st.participantes, icon:'👥'}, {label:'Sesiones programadas', value:st.sesiones, icon:'📅'}].map((item,i)=>(
                  <div key={i} style={{ padding:'14px 20px', borderRight:i===0?'1px solid var(--gt-border)':'none' }}>
                    <p style={{ fontSize:11, color:'var(--gt-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:1, margin:'0 0 4px' }}>{item.icon} {item.label}</p>
                    <p style={{ fontSize:28, fontWeight:800, color:meta.colorText, margin:0 }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* ── Toggle sesiones ── */}
              <div style={{ padding:'12px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <button onClick={()=>setExpanded(prev=>({...prev,[ruta.id]:!open}))} style={{
                  background:'none', border:'none', color:'var(--gt-primary)', fontWeight:700, fontSize:13, cursor:'pointer',
                  display:'flex', alignItems:'center', gap:6, fontFamily:"'DM Sans',sans-serif",
                }}>
                  {open ? '▲' : '▼'} {open ? 'Ocultar sesiones' : `Ver ${ses.length} sesiones`}
                </button>
                <Btn size="sm" icon="plus" onClick={()=>abrirNuevaSesion(ruta.id)}>Nueva sesión</Btn>
              </div>

              {/* ── Lista de sesiones ── */}
              {open && (
                <div style={{ borderTop:'1px solid var(--gt-border)' }}>
                  {ses.length === 0 ? (
                    <p style={{ padding:'18px 20px', color:'var(--gt-muted)', fontSize:13 }}>Sin sesiones registradas.</p>
                  ) : ses.map((s, idx) => (
                    <div key={s.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 20px', borderBottom:idx<ses.length-1?'1px solid var(--gt-border)':'none' }}
                      onMouseEnter={e=>{e.currentTarget.style.background='var(--gt-bg)'}}
                      onMouseLeave={e=>{e.currentTarget.style.background=''}}>
                      <div style={{ width:28, height:28, borderRadius:8, background:'var(--gt-primary-light)', color:'var(--gt-primary)', fontWeight:800, fontSize:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{idx+1}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontWeight:700, fontSize:14, color:'var(--gt-text)', margin:'0 0 2px' }}>{s.nombre}</p>
                        <p style={{ fontSize:12, color:'var(--gt-muted)', margin:0 }}>
                          {s.fecha||'—'}{s.horaInicio?` · ${s.horaInicio}`:''}
                          {s.horaFin?` – ${s.horaFin}`:''}
                          {s.lugar?` · 📍 ${s.lugar}`:''}
                          {s.encargado?` · 👤 ${s.encargado}`:''}
                        </p>
                      </div>
                      <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                        <Btn size="sm" variant="ghost" icon="edit" onClick={()=>abrirEditarSesion(s, ruta.id)} />
                        <Btn size="sm" variant="danger" icon="trash" onClick={()=>eliminarSesion(s.id, ruta.id)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Modal editar descripción ruta */}
      <Modal open={modal} onClose={()=>setModal(false)} title={`Editar: ${formRuta?.nombre}`} width={420}>
        <p style={{ fontSize:13, color:'var(--gt-muted)', marginBottom:14 }}>El nombre del módulo es fijo. Solo puedes editar la descripción.</p>
        <div style={{ marginBottom:20 }}>
          <label style={{ display:'block', fontSize:12, fontWeight:700, color:'var(--gt-text)', marginBottom:6 }}>Descripción</label>
          <textarea value={descEdit} onChange={e=>setDescEdit(e.target.value)} rows={3}
            placeholder="Describe brevemente esta ruta..."
            style={{ width:'100%', padding:'9px 13px', border:'1.5px solid var(--gt-border)', borderRadius:9, fontSize:14, outline:'none', resize:'vertical', fontFamily:"'DM Sans',sans-serif", boxSizing:'border-box' }}
            onFocus={e=>{e.target.style.borderColor='var(--gt-primary)'}} onBlur={e=>{e.target.style.borderColor='var(--gt-border)'}}/>
        </div>
        <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
          <Btn variant="ghost" onClick={()=>setModal(false)}>Cancelar</Btn>
          <Btn onClick={guardarDesc} disabled={saving}>{saving?'Guardando…':'Guardar'}</Btn>
        </div>
      </Modal>

      {/* Modal crear/editar sesión */}
      <Modal open={modalSes} onClose={()=>setModalSes(false)} title={formSes.id?'Editar sesión':'Nueva sesión'}>
        <Input label="Nombre *" value={formSes.nombre||''} onChange={e=>setFormSes({...formSes,nombre:e.target.value})} autoFocus/>
        <Input label="Fecha *" type="date" value={formSes.fecha||''} onChange={e=>setFormSes({...formSes,fecha:e.target.value})}/>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Input label="Hora inicio" type="time" value={formSes.horaInicio||''} onChange={e=>setFormSes({...formSes,horaInicio:e.target.value})}/>
          <Input label="Hora fin" type="time" value={formSes.horaFin||''} onChange={e=>setFormSes({...formSes,horaFin:e.target.value})}/>
        </div>
        <Input label="Lugar" value={formSes.lugar||''} onChange={e=>setFormSes({...formSes,lugar:e.target.value})} placeholder="Ej. Cancha C"/>
        <Input label="Encargado" value={formSes.encargado||''} onChange={e=>setFormSes({...formSes,encargado:e.target.value})} placeholder="Nombre del encargado"/>
        <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:4 }}>
          <Btn variant="ghost" onClick={()=>setModalSes(false)}>Cancelar</Btn>
          <Btn onClick={guardarSesion} disabled={saving||!formSes.nombre?.trim()||!formSes.fecha}>
            {saving?'Guardando…':formSes.id?'Guardar cambios':'Crear sesión'}
          </Btn>
        </div>
      </Modal>
    </div>
  )
}
