import { useState, useEffect } from 'react'
import { usePreguntas, useFichas, useRutas } from '../../../application/hooks'
import { Pregunta } from '../../../domain/models'
import { Btn, Input, Textarea, PageHeader, Modal, Badge, Card, TabBar } from '../../components/ui/index'
import { getAnswerLabel, parsePregunta } from '../../components/FichaForm'

const TIPOS_FICHA = [
  { key: 'PRE',  label: 'PRE-test'  },
  { key: 'POST', label: 'POST-test' },
]

export default function FichasPage() {
  const r      = useRutas()
  const preg   = usePreguntas()
  const fichas = useFichas()

  const [tabMain, setTabMain] = useState('preguntas')   // preguntas | consultar
  const [tabTipo, setTabTipo] = useState('PRE')          // PRE | POST (per ruta)

  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState(Pregunta.empty())
  const [saving, setSaving]   = useState(false)

  const [pregsPorRuta, setPregsPorRuta] = useState({})  // { rutaId: { PRE: [], POST: [] } }

  // Consultar fichas
  const [consultaForm, setConsultaForm] = useState({ inscripcionId:'', fichaPreId:'' })
  const [fichaResult, setFichaResult]   = useState(null)
  const [buscando, setBuscando]         = useState(false)

  useEffect(() => { cargarTodas() }, [r.data])

  const cargarTodas = async () => {
    if (!r.data.length) return
    const res = {}
    await Promise.all(r.data.map(async ruta => {
      try {
        const { preguntaRepo } = await import('../../../infrastructure/repositories')
        const all = await preguntaRepo.findByRuta(ruta.id)
        res[ruta.id] = {
          PRE:  all.filter(p => !p.tipo || p.tipo === 'PRE'),
          POST: all.filter(p => p.tipo === 'POST'),
        }
      } catch { res[ruta.id] = { PRE: [], POST: [] } }
    }))
    setPregsPorRuta(res)
  }

  const recargarRuta = async (rutaId) => {
    try {
      const { preguntaRepo } = await import('../../../infrastructure/repositories')
      const all = await preguntaRepo.findByRuta(rutaId)
      setPregsPorRuta(prev => ({
        ...prev,
        [rutaId]: {
          PRE:  all.filter(p => !p.tipo || p.tipo === 'PRE'),
          POST: all.filter(p => p.tipo === 'POST'),
        }
      }))
    } catch {}
  }

  const abrirModal = (rutaId, tipo, pregExistente = null) => {
    const pregsRuta = pregsPorRuta[rutaId]?.[tipo] || []
    setForm(pregExistente
      ? { ...pregExistente, _rutaId: rutaId, _tipo: tipo }
      : { ...Pregunta.empty(), orden: pregsRuta.length + 1, _rutaId: rutaId, _tipo: tipo }
    )
    setModal(true)
  }

  const savePregunta = async () => {
    if (!form.texto?.trim()) return
    setSaving(true)
    try {
      if (form.id) {
        await preg.actualizar(form.id, { texto: form.texto, orden: form.orden })
      } else {
        await preg.crear({ texto: form.texto, orden: form.orden, rutaId: parseInt(form._rutaId), tipo: form._tipo })
      }
      setModal(false)
      await recargarRuta(form._rutaId)
    } catch {}
    setSaving(false)
  }

  const desactivar = async (pregId, rutaId) => {
    if (!confirm('¿Desactivar esta pregunta?')) return
    await preg.desactivar(pregId)
    await recargarRuta(rutaId)
  }

  const lookupPre = async () => {
    if (!consultaForm.inscripcionId) return
    setBuscando(true)
    try { setFichaResult(await fichas.obtenerPre(consultaForm.inscripcionId)) } catch { setFichaResult(null) }
    setBuscando(false)
  }

  const lookupPost = async () => {
    if (!consultaForm.fichaPreId) return
    setBuscando(true)
    try { setFichaResult(await fichas.obtenerPost(consultaForm.fichaPreId)) } catch { setFichaResult(null) }
    setBuscando(false)
  }

  // Obtener todas las preguntas (PRE+POST) para decodificar respuestas
  const allPregs = Object.values(pregsPorRuta).flatMap(({ PRE, POST }) => [...(PRE||[]), ...(POST||[])])

  return (
    <div>
      <PageHeader title="Fichas y Preguntas" subtitle="Instrumentos PRE/POST por módulo" />

      <TabBar
        tabs={[{ key:'preguntas', label:'Preguntas por módulo' }, { key:'consultar', label:'Consultar fichas' }]}
        active={tabMain}
        onChange={t => { setTabMain(t); setFichaResult(null) }}
      />

      {/* ── PREGUNTAS POR MÓDULO ── */}
      {tabMain === 'preguntas' && (
        <div>
          {/* Sub-tabs PRE | POST */}
          <div style={{ display:'flex', gap:8, marginBottom:20 }}>
            {TIPOS_FICHA.map(tf => (
              <button key={tf.key} onClick={() => setTabTipo(tf.key)} style={{
                padding:'8px 22px', borderRadius:10, border:'1.5px solid', cursor:'pointer',
                fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:14, transition:'all .15s',
                borderColor: tabTipo===tf.key ? 'var(--gt-primary)' : 'var(--gt-border)',
                background: tabTipo===tf.key ? 'var(--gt-primary)' : '#fff',
                color: tabTipo===tf.key ? '#fff' : 'var(--gt-muted)',
              }}>{tf.label}</button>
            ))}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {r.data.length === 0 && <p style={{ color:'var(--gt-muted)', fontSize:14 }}>Cargando módulos...</p>}

            {r.data.map(ruta => {
              const pregs   = (pregsPorRuta[ruta.id]?.[tabTipo] || []).filter(p => p.activa !== false)
              const inact   = (pregsPorRuta[ruta.id]?.[tabTipo] || []).filter(p => p.activa === false)
              return (
                <div key={ruta.id} style={{ background:'#fff', borderRadius:16, border:'1px solid var(--gt-border)', overflow:'hidden', boxShadow:'var(--gt-shadow-sm)' }}>
                  {/* Cabecera */}
                  <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--gt-border)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ fontSize:22 }}>{ruta.nombre?.includes('Fallo')?'🔥':'🎨'}</span>
                      <div>
                        <h3 style={{ fontWeight:800, fontSize:16, color:'var(--gt-text)', margin:0 }}>{ruta.nombre}</h3>
                        <span style={{ fontSize:11, fontWeight:700, color:'var(--gt-muted)', textTransform:'uppercase', letterSpacing:1 }}>{tabTipo}-test</span>
                      </div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <Badge text={`${pregs.length} activas`} color="var(--gt-primary)" />
                      <Btn size="sm" variant="secondary" icon="plus" onClick={() => abrirModal(ruta.id, tabTipo)}>
                        Agregar
                      </Btn>
                    </div>
                  </div>

                  {/* Lista de preguntas */}
                  {pregs.length === 0 ? (
                    <div style={{ padding:'24px', textAlign:'center', color:'var(--gt-muted)', fontSize:13 }}>
                      Sin preguntas {tabTipo} activas. Agrégalas o insértalas por SQL.
                    </div>
                  ) : pregs.map((p, idx) => {
                    const { label } = parsePregunta(p.texto)
                    return (
                      <div key={p.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 20px', borderBottom: idx<pregs.length-1?'1px solid var(--gt-border)':'none' }}
                        onMouseEnter={e=>{ e.currentTarget.style.background='var(--gt-bg)' }}
                        onMouseLeave={e=>{ e.currentTarget.style.background='' }}>
                        <div style={{ width:28, height:28, borderRadius:8, background:'var(--gt-primary-light)', color:'var(--gt-primary)', fontWeight:800, fontSize:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          {p.orden || idx+1}
                        </div>
                        <p style={{ flex:1, fontSize:14, color:'var(--gt-text)', margin:0, lineHeight:1.4 }}>{label}</p>
                        <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                          <button onClick={()=>abrirModal(ruta.id, tabTipo, p)} style={{ background:'none', border:'none', color:'var(--gt-primary)', fontWeight:700, fontSize:13, cursor:'pointer', padding:'4px 8px', borderRadius:6, fontFamily:"'DM Sans',sans-serif" }}>Editar</button>
                          <button onClick={()=>desactivar(p.id, ruta.id)} style={{ background:'none', border:'none', color:'var(--gt-danger)', fontWeight:700, fontSize:13, cursor:'pointer', padding:'4px 8px', borderRadius:6, fontFamily:"'DM Sans',sans-serif" }}>Desactivar</button>
                        </div>
                      </div>
                    )
                  })}
                  {inact.length > 0 && (
                    <div style={{ padding:'9px 20px', background:'var(--gt-bg)', borderTop:'1px solid var(--gt-border)' }}>
                      <p style={{ fontSize:12, color:'var(--gt-muted)', margin:0 }}>{inact.length} pregunta{inact.length>1?'s':''} inactiva{inact.length>1?'s':''}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── CONSULTAR FICHAS ── */}
      {tabMain === 'consultar' && (
        <Card style={{ maxWidth:600 }}>
          <h4 style={{ margin:'0 0 16px', fontWeight:800, fontSize:16 }}>Consultar fichas diligenciadas</h4>

          <div style={{ marginBottom:14, padding:'12px 16px', background:'var(--gt-bg)', borderRadius:10, border:'1px solid var(--gt-border)' }}>
            <p style={{ fontSize:12, fontWeight:700, color:'var(--gt-muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>Ficha PRE</p>
            <div style={{ display:'flex', gap:8 }}>
              <Input placeholder="ID inscripción" value={consultaForm.inscripcionId}
                onChange={e=>setConsultaForm({...consultaForm,inscripcionId:e.target.value})}
                style={{ marginBottom:0, flex:1 }} />
              <Btn variant="secondary" size="sm" onClick={lookupPre} disabled={buscando||!consultaForm.inscripcionId}>
                {buscando?'…':'Buscar'}
              </Btn>
            </div>
          </div>

          <div style={{ marginBottom:20, padding:'12px 16px', background:'var(--gt-bg)', borderRadius:10, border:'1px solid var(--gt-border)' }}>
            <p style={{ fontSize:12, fontWeight:700, color:'var(--gt-muted)', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>Ficha POST</p>
            <div style={{ display:'flex', gap:8 }}>
              <Input placeholder="ID ficha PRE" value={consultaForm.fichaPreId}
                onChange={e=>setConsultaForm({...consultaForm,fichaPreId:e.target.value})}
                style={{ marginBottom:0, flex:1 }} />
              <Btn variant="secondary" size="sm" onClick={lookupPost} disabled={buscando||!consultaForm.fichaPreId}>
                {buscando?'…':'Buscar'}
              </Btn>
            </div>
          </div>

          {fichaResult && (
            <div style={{ background:'#F0FAF4', borderRadius:12, border:'1px solid #BBF7D0', overflow:'hidden' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'13px 18px', borderBottom:'1px solid #BBF7D0' }}>
                <span style={{ fontWeight:800, fontSize:14, color:'#111' }}>Ficha #{fichaResult.id}</span>
                <Badge text={fichaResult.completada?'Completada':'Pendiente'} color={fichaResult.completada?'#16a34a':'#f59e0b'} />
              </div>
              <div>
                {fichaResult.respuestas?.map((resp, i) => {
                  const pregunta = allPregs.find(p => p.id === resp.preguntaId)
                  const textoP   = pregunta?.texto || ''
                  const { label } = parsePregunta(textoP)
                  const decoded   = getAnswerLabel(textoP, resp.valor)
                  return (
                    <div key={resp.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'9px 18px', borderBottom:'1px solid #D1FAE5', gap:12 }}>
                      <span style={{ color:'#374151', fontSize:13, flex:1, lineHeight:1.4 }}>{label || `Pregunta ${resp.preguntaId}`}</span>
                      <span style={{ fontWeight:700, color:'#16a34a', fontSize:13, flexShrink:0 }}>{decoded}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Modal nueva/editar pregunta */}
      <Modal open={modal} onClose={()=>setModal(false)} title={form.id?'Editar pregunta':'Nueva pregunta'} width={500}>
        <div style={{ marginBottom:10, padding:'10px 14px', background:'var(--gt-bg)', borderRadius:8, fontSize:12, color:'var(--gt-muted)', lineHeight:1.6 }}>
          <strong>Formato del texto:</strong> usa el prefijo para que el formulario renderice correctamente.<br/>
          <code>[SELECT|Opción1,Opción2]Texto de la pregunta</code><br/>
          <code>[SCALE5|Muy baja,Muy buena]Texto</code><br/>
          <code>[NUMBER|kg]Texto</code><br/>
          <code>[MATRIX|Disminuyó,Igual,Mejoró|grupo_id]Sub-ítem</code>
        </div>
        <Textarea
          label="Texto de la pregunta *"
          value={form.texto}
          onChange={e=>setForm({...form,texto:e.target.value})}
          placeholder="[SELECT|Opción1,Opción2]¿Cuál es tu…?"
          rows={3}
        />
        <Input label="Orden" type="number" value={form.orden}
          onChange={e=>setForm({...form,orden:parseInt(e.target.value)||''})} min={1} />
        <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:4 }}>
          <Btn variant="ghost" onClick={()=>setModal(false)}>Cancelar</Btn>
          <Btn onClick={savePregunta} disabled={saving||!form.texto?.trim()}>
            {saving?'Guardando…':form.id?'Actualizar':'Agregar pregunta'}
          </Btn>
        </div>
      </Modal>
    </div>
  )
}
