import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../../application/context/ToastContext'
import { useAsistencia, useFichas, usePreguntas } from '../../../application/hooks'
import { inscripcionRepo, rutaRepo, sesionRepo, alertaRepo } from '../../../infrastructure/repositories'
import { Card, Btn, Badge, TabBar } from '../../components/ui/index'
import Icon from '../../components/ui/Icon'

const TIPS = [
  { icon: '🧘', titulo: 'Respiración 4-7-8', texto: 'Inhala 4 segundos, retén 7, exhala 8. Repite 3 veces cuando sientas tensión.' },
  { icon: '🚶', titulo: 'Muévete 5 minutos', texto: 'Levántate, estira los brazos y camina un poco. El movimiento resetea la mente.' },
  { icon: '💧', titulo: 'Hidratación', texto: 'Beber agua regularmente mejora la concentración y el estado de ánimo.' },
  { icon: '📵', titulo: 'Pausa digital', texto: 'Tómate 10 minutos sin pantalla. Tu mente necesita descanso real.' },
  { icon: '✍️', titulo: 'Escribe una meta', texto: 'Escribe una sola cosa que quieras lograr hoy, por pequeña que sea.' },
  { icon: '🌿', titulo: 'Naturaleza', texto: 'Salir 10 minutos al aire libre reduce el cortisol y mejora el humor.' },
]

const FRASES = [
  { texto: 'El cuidado de uno mismo no es un lujo, es una necesidad.', autor: 'Audre Lorde' },
  { texto: 'No puedes controlar todo lo que pasa, pero sí cómo respondes a ello.', autor: 'Epicteto' },
  { texto: 'La salud mental es tan importante como la física.', autor: 'Gimnasio Transmoderno' },
  { texto: 'Cada día es una nueva oportunidad para crecer.', autor: 'Anónimo' },
  { texto: 'Pedir ayuda es una señal de fortaleza, no de debilidad.', autor: 'Anónimo' },
  { texto: 'El progreso, no la perfección, es la meta.', autor: 'Anónimo' },
]

const EMOJIS = [
  { key: 'mal',     emoji: '😞', label: 'Mal'     },
  { key: 'regular', emoji: '😕', label: 'Regular' },
  { key: 'bien',    emoji: '😊', label: 'Bien'    },
  { key: 'genial',  emoji: '😄', label: 'Genial'  },
  { key: 'pleno',   emoji: '🤩', label: 'Pleno'   },
]

const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join('')

const greeting = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Buenos días' : h < 18 ? 'Buenas tardes' : 'Buenas noches'
}

const randomItem = arr => arr[Math.floor(Math.random() * arr.length)]

function BackBtn({ onBack, label = '← Volver' }) {
  return (
    <button onClick={onBack} style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none',
      color: '#627066', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '4px 0',
      fontFamily: "'DM Sans', sans-serif",
    }}>{label}</button>
  )
}

function Chip({ icon, text }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,.25)',
      color: 'rgba(255,255,255,.9)', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
    }}>{icon} {text}</span>
  )
}

export default function StudentHomePage() {
  const nav       = useNavigate()
  const toast     = useToast()
  const asistencia = useAsistencia()
  const fichas    = useFichas()
  const preguntas = usePreguntas()

  const [student, setStudent]           = useState(null)
  const [inscripciones, setInscripciones] = useState([])
  const [rutas, setRutas]               = useState([])
  const [sesionActiva, setSesionActiva] = useState(null)
  const [tab, setTab]                   = useState('home')
  const [loading, setLoading]           = useState(false)
  const [fichaTab, setFichaTab]         = useState('pre')
  const [selectedInscripcion, setSelectedInscripcion] = useState(null)
  const [respuestas, setRespuestas]     = useState([])
  const [emojiSel, setEmojiSel]         = useState(null)
  const [fraseActual, setFraseActual]   = useState(() => randomItem(FRASES))
  const [inscribiendo, setInscribiendo] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('tm_student')
    if (!saved) { nav('/login/estudiante'); return }
    const p = JSON.parse(saved)
    setStudent(p)
    loadData(p.numeroIdentificacion)
  }, [])

  const loadData = async (numero) => {
    try {
      const [inscs, rs] = await Promise.all([
        inscripcionRepo.findByParticipante(numero),
        rutaRepo.findAll(),
      ])
      const activas = inscs.filter(i => i.estado === 'ACTIVA')
      setInscripciones(activas)
      setRutas(rs)
      setSesionActiva(null)
      for (const insc of activas) {
        try {
          const s = await sesionRepo.findActiva(insc.rutaId)
          if (s && s.id) { setSesionActiva({ ...s, rutaId: insc.rutaId, inscripcionId: insc.id }); break }
        } catch {}
      }
    } catch {}
  }

  const rutaName = (id) => rutas.find(r => r.id === id)?.nombre || `Ruta ${id}`
  const rutaObj  = (id) => rutas.find(r => r.id === id)

  const registrarAsistencia = async () => {
    if (!sesionActiva) return
    setLoading(true)
    try { await asistencia.registrar(student.numeroIdentificacion, sesionActiva.rutaId) }
    catch {}
    setLoading(false)
  }

  const levantarMano = async () => {
    setLoading(true)
    try { await alertaRepo.crearSolicitud(student.numeroIdentificacion); toast('Solicitud enviada discretamente') }
    catch (e) { toast(e.mensaje || 'Error', 'error') }
    setLoading(false)
  }

  const setRespuesta = (preguntaId, valor) =>
    setRespuestas(prev => [...prev.filter(r => r.preguntaId !== preguntaId), { preguntaId, valor }])

  const submitFichaPre = async () => {
    if (!selectedInscripcion) return
    setLoading(true)
    try { await fichas.crearPre({ inscripcionId: selectedInscripcion.id, respuestas }); setRespuestas([]); setTab('home') }
    catch {}
    setLoading(false)
  }

  const submitFichaPost = async () => {
    if (!selectedInscripcion) return
    setLoading(true)
    try {
      const pre = await fichas.obtenerPre(selectedInscripcion.id)
      await fichas.crearPost({ fichaPreId: pre.id, respuestas })
      setRespuestas([]); setTab('home')
    } catch {}
    setLoading(false)
  }

  const selectInscripcionForFicha = (insc) => {
    setSelectedInscripcion(insc); preguntas.loadByRuta(insc.rutaId); setRespuestas([])
  }

  const inscribirseARuta = async (rutaId) => {
    setInscribiendo(true)
    try {
      await inscripcionRepo.inscribir(student.numeroIdentificacion, rutaId)
      toast(`Inscrito a ${rutaName(rutaId)}`)
      await loadData(student.numeroIdentificacion)
    } catch (e) { toast(e.mensaje || 'No se pudo inscribir', 'error') }
    setInscribiendo(false)
  }

  const cancelarInscripcion = async (inscId, nombre) => {
    if (!confirm(`Cancelar inscripcion a "${nombre}"?`)) return
    setInscribiendo(true)
    try {
      await inscripcionRepo.finalizar(inscId)
      toast('Inscripcion cancelada')
      setSesionActiva(null)
      await loadData(student.numeroIdentificacion)
    } catch (e) { toast(e.mensaje || 'No se pudo cancelar', 'error') }
    setInscribiendo(false)
  }

  if (!student) return null
  const firstName = student.nombreCompleto?.split(' ')[0] || 'Estudiante'
  const inits = initials(student.nombreCompleto)

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#1A2318', minHeight: '100vh', background: '#F0F4F1' }}>

      {/* HEADER */}
      <div style={{ background: '#0D5C2F', padding: '20px 20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 13, margin: 0 }}>{greeting()},</p>
          <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 800, margin: '2px 0 0' }}>{firstName}</h2>
          <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 12, margin: '4px 0 0' }}>
            {student.programaAcademico} · Sem. {student.semestre}
          </p>
        </div>
        <button onClick={() => setTab('ajustes')} title="Perfil y ajustes" style={{
          width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,.2)',
          border: '2px solid rgba(255,255,255,.4)', color: '#fff', fontWeight: 800, fontSize: 15,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>{inits}</button>
      </div>

      <div style={{ padding: '0 16px 40px' }}>

        {/* ── HOME ─────────────────────────────────────────────────────────── */}
        {tab === 'home' && (
          <div>
            {/* Como te sientes */}
            <div style={{ background: '#fff', borderRadius: '0 0 16px 16px', padding: '16px 16px 18px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#627066', margin: '0 0 12px' }}>Como te sientes hoy?</p>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {EMOJIS.map(e => (
                  <button key={e.key} onClick={() => setEmojiSel(e.key)} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    background: emojiSel === e.key ? '#E8F5ED' : 'transparent',
                    border: emojiSel === e.key ? '2px solid #0D5C2F' : '2px solid transparent',
                    borderRadius: 12, padding: '8px 6px', cursor: 'pointer', transition: 'all .15s', minWidth: 52,
                  }}>
                    <span style={{ fontSize: 28, lineHeight: 1 }}>{e.emoji}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: emojiSel === e.key ? '#0D5C2F' : '#627066' }}>{e.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Accesos rapidos */}
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '4px 0 14px', scrollbarWidth: 'none' }}>
              {[
                { key: 'hoy',    icon: '📅', label: 'Hoy',     color: '#E8F5ED' },
                { key: 'miRuta', icon: '🌱', label: 'Mi ruta', color: '#FEF3DC' },
                { key: 'tips',   icon: '💡', label: 'Tips',    color: '#EDE9FE' },
                { key: 'frase',  icon: '✨', label: 'Frase',   color: '#FEE2E2' },
                { key: 'mas',    icon: '➕', label: 'Más',     color: '#F0F4F1' },
              ].map(item => (
                <button key={item.key} onClick={() => setTab(item.key)} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  background: item.color, border: '1.5px solid rgba(0,0,0,.06)',
                  borderRadius: 16, padding: '12px 10px', cursor: 'pointer',
                  minWidth: 64, flexShrink: 0, transition: 'transform .15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = '' }}
                >
                  <span style={{ fontSize: 26, lineHeight: 1 }}>{item.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#374151' }}>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Tarjeta Tu Ruta */}
            {inscripciones.length > 0 && (
              <div style={{
                background: 'linear-gradient(135deg,#0D5C2F,#16A34A)', borderRadius: 16,
                padding: '18px 20px', marginBottom: 14, boxShadow: '0 4px 16px rgba(13,92,47,.3)',
              }}>
                <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, margin: '0 0 6px' }}>TU RUTA</p>
                <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 800, margin: '0 0 4px' }}>
                  {rutaName(inscripciones[0].rutaId)}
                </h3>
                {sesionActiva
                  ? <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 13, margin: 0 }}>
                      Proxima sesion: {sesionActiva.nombre}{sesionActiva.fecha ? ` · ${sesionActiva.fecha}` : ''}{sesionActiva.horaInicio ? ` · ${sesionActiva.horaInicio}` : ''}
                    </p>
                  : <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 13, margin: 0 }}>Sin sesion activa por ahora</p>
                }
                <div style={{ marginTop: 14, background: 'rgba(255,255,255,.2)', borderRadius: 4, height: 4 }}>
                  <div style={{ background: 'rgba(255,255,255,.8)', height: 4, width: '60%', borderRadius: 4 }} />
                </div>
              </div>
            )}

            {/* Sin inscripciones */}
            {inscripciones.length === 0 && (
              <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 14, textAlign: 'center', border: '1.5px dashed #D4E2D8' }}>
                <p style={{ fontSize: 28, marginBottom: 6 }}>🌱</p>
                <p style={{ fontWeight: 700, color: '#1A2318', marginBottom: 4 }}>Aun no estas inscrito</p>
                <p style={{ fontSize: 13, color: '#627066', marginBottom: 14 }}>Inscribete a una ruta desde Ajustes</p>
                <button onClick={() => setTab('ajustes')} style={{ padding: '8px 20px', background: '#0D5C2F', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  Ir a ajustes
                </button>
              </div>
            )}

            {/* Tarjetas existentes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Card onClick={sesionActiva ? registrarAsistencia : undefined} style={{ cursor: sesionActiva ? 'pointer' : 'default', opacity: sesionActiva ? 1 : .5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f0faf0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="check" size={22} color="#16a34a" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>Registrar asistencia</div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>{sesionActiva ? `Sesion: ${sesionActiva.nombre}` : 'No hay sesion activa en este momento'}</div>
                  </div>
                  {loading && <span style={{ fontSize: 12, color: '#16a34a' }}>Registrando...</span>}
                </div>
              </Card>

              <Card onClick={() => setTab('fichas')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="clipboard" size={22} color="#f59e0b" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>Fichas PRE / POST</div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>Cuestionario de seguimiento de bienestar</div>
                  </div>
                </div>
              </Card>

              <Card onClick={levantarMano} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="hand" size={22} color="#7c3aed" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>Levantar la mano</div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>Solicita orientacion de manera discreta</div>
                  </div>
                </div>
              </Card>

              {inscripciones.length > 0 && (
                <Card>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 12 }}>Mis inscripciones activas</div>
                  {inscripciones.map(i => (
                    <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ fontSize: 14, color: '#374151' }}>{rutaName(i.rutaId)}</span>
                      <Badge text="Activa" color="#16a34a" />
                    </div>
                  ))}
                </Card>
              )}
            </div>
          </div>
        )}

        {/* ── MI RUTA (solo info) ───────────────────────────────────────────── */}
        {tab === 'miRuta' && (
          <div style={{ paddingTop: 16 }}>
            <BackBtn onBack={() => setTab('home')} />
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: '12px 0 16px' }}>Mi Ruta</h3>
            {inscripciones.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#627066' }}>
                <p style={{ fontSize: 32, marginBottom: 8 }}>🌱</p>
                <p style={{ fontWeight: 700 }}>No tienes ruta activa</p>
                <p style={{ fontSize: 13, marginTop: 4 }}>Inscribete desde Ajustes</p>
              </div>
            ) : inscripciones.map(insc => {
              const ruta = rutaObj(insc.rutaId)
              return (
                <div key={insc.id} style={{ marginBottom: 16 }}>
                  <div style={{ background: 'linear-gradient(135deg,#0D5C2F,#16A34A)', borderRadius: 16, padding: 20, marginBottom: 12 }}>
                    <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, margin: '0 0 4px' }}>Ruta activa</p>
                    <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 8px' }}>{ruta?.nombre || rutaName(insc.rutaId)}</h2>
                    {ruta?.descripcion && <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 13, margin: 0 }}>{ruta.descripcion}</p>}
                  </div>
                  <Card>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#627066', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>Proxima sesion</p>
                    {sesionActiva && sesionActiva.rutaId === insc.rutaId ? (
                      <div>
                        <p style={{ fontWeight: 800, fontSize: 17, color: '#1A2318', marginBottom: 8 }}>{sesionActiva.nombre}</p>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                          {sesionActiva.fecha && <span style={{ fontSize: 13, color: '#627066' }}>📅 {sesionActiva.fecha}</span>}
                          {sesionActiva.horaInicio && <span style={{ fontSize: 13, color: '#627066' }}>🕐 {sesionActiva.horaInicio}</span>}
                          {sesionActiva.lugar && <span style={{ fontSize: 13, color: '#627066' }}>📍 {sesionActiva.lugar}</span>}
                        </div>
                      </div>
                    ) : (
                      <p style={{ fontSize: 13, color: '#627066' }}>Sin sesion activa por ahora</p>
                    )}
                  </Card>
                </div>
              )
            })}
          </div>
        )}

        {/* ── TIPS ─────────────────────────────────────────────────────────── */}
        {tab === 'tips' && (
          <div style={{ paddingTop: 16 }}>
            <BackBtn onBack={() => setTab('home')} />
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: '12px 0 4px' }}>Tips de bienestar</h3>
            <p style={{ fontSize: 13, color: '#627066', marginBottom: 20 }}>Pequenas acciones que hacen la diferencia.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {TIPS.map((t, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '16px 18px', border: '1px solid #D4E2D8', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E8F5ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{t.icon}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: '#1A2318', marginBottom: 4 }}>{t.titulo}</p>
                    <p style={{ fontSize: 13, color: '#627066', lineHeight: 1.5 }}>{t.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FRASE ────────────────────────────────────────────────────────── */}
        {tab === 'frase' && (
          <div style={{ paddingTop: 16 }}>
            <BackBtn onBack={() => setTab('home')} />
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: '12px 0 20px' }}>Frase del dia</h3>
            <div style={{ background: 'linear-gradient(135deg,#0D5C2F,#16A34A)', borderRadius: 20, padding: '36px 28px', textAlign: 'center', marginBottom: 20, boxShadow: '0 8px 24px rgba(13,92,47,.3)' }}>
              <p style={{ color: '#fff', fontSize: 20, fontWeight: 700, lineHeight: 1.5, margin: '0 0 16px' }}>"{fraseActual.texto}"</p>
              <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 13 }}>— {fraseActual.autor}</p>
            </div>
            <button onClick={() => setFraseActual(randomItem(FRASES))} style={{ width: '100%', padding: 12, background: '#fff', border: '1.5px solid #D4E2D8', borderRadius: 12, fontWeight: 700, fontSize: 14, color: '#0D5C2F', cursor: 'pointer' }}>
              Nueva frase 🔄
            </button>
          </div>
        )}

        {/* ── HOY ──────────────────────────────────────────────────────────── */}
        {tab === 'hoy' && (
          <div style={{ paddingTop: 16 }}>
            <BackBtn onBack={() => setTab('home')} />
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: '12px 0 20px' }}>Hoy</h3>
            {sesionActiva ? (
              <div style={{ background: '#E8F5ED', borderRadius: 16, padding: 20, border: '1px solid #D4E2D8' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#0D5C2F', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6 }}>Sesion activa</p>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1A2318', marginBottom: 10 }}>{sesionActiva.nombre}</h2>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
                  {sesionActiva.fecha && <span style={{ fontSize: 13, color: '#627066' }}>📅 {sesionActiva.fecha}</span>}
                  {sesionActiva.horaInicio && <span style={{ fontSize: 13, color: '#627066' }}>🕐 {sesionActiva.horaInicio}{sesionActiva.horaFin ? ` - ${sesionActiva.horaFin}` : ''}</span>}
                  {sesionActiva.lugar && <span style={{ fontSize: 13, color: '#627066' }}>📍 {sesionActiva.lugar}</span>}
                </div>
                <button onClick={() => { registrarAsistencia(); setTab('home') }} disabled={loading} style={{ width: '100%', padding: 13, background: '#0D5C2F', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1 }}>
                  {loading ? 'Registrando...' : 'Registrar mi asistencia'}
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#627066' }}>
                <p style={{ fontSize: 40, marginBottom: 12 }}>📭</p>
                <p style={{ fontWeight: 700, fontSize: 16 }}>No hay sesion activa hoy</p>
                <p style={{ fontSize: 13, marginTop: 4 }}>Revisa con tu encargado el calendario</p>
              </div>
            )}
          </div>
        )}

        {/* ── MAS ──────────────────────────────────────────────────────────── */}
        {tab === 'mas' && (
          <div style={{ paddingTop: 16 }}>
            <BackBtn onBack={() => setTab('home')} />
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: '12px 0 20px' }}>Mas opciones</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: '✋', label: 'Levantar la mano', desc: 'Solicita orientacion de forma discreta', color: '#EDE9FE', fn: () => { levantarMano(); setTab('home') } },
                { icon: '📝', label: 'Mis fichas', desc: 'Cuestionarios PRE y POST', color: '#FEF3DC', fn: () => setTab('fichas') },
                { icon: '🌱', label: 'Mi ruta', desc: 'Ver informacion de tu ruta activa', color: '#E8F5ED', fn: () => setTab('miRuta') },
                { icon: '⚙️', label: 'Ajustes', desc: 'Perfil e inscripciones', color: '#F0F4F1', fn: () => setTab('ajustes') },
              ].map((item, i) => (
                <button key={i} onClick={item.fn} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: item.color, borderRadius: 14, border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                  <span style={{ fontSize: 28 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: '#1A2318', margin: 0 }}>{item.label}</p>
                    <p style={{ fontSize: 12, color: '#627066', margin: 0 }}>{item.desc}</p>
                  </div>
                  <span style={{ marginLeft: 'auto', color: '#D4E2D8', fontSize: 20 }}>›</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── FICHAS (existente) ────────────────────────────────────────────── */}
        {tab === 'fichas' && (
          <div style={{ paddingTop: 16 }}>
            <BackBtn onBack={() => { setTab('home'); setSelectedInscripcion(null); setRespuestas([]) }} />
            <h3 style={{ margin: '12px 0 16px', fontSize: 20, fontWeight: 800 }}>Fichas de bienestar</h3>
            {!selectedInscripcion ? (
              <div>
                <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>Selecciona la inscripcion:</p>
                {inscripciones.map(i => (
                  <Card key={i.id} onClick={() => selectInscripcionForFicha(i)} style={{ cursor: 'pointer', marginBottom: 8 }}>
                    <div style={{ fontWeight: 600, color: '#111' }}>{rutaName(i.rutaId)}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>Inscripcion #{i.id}</div>
                  </Card>
                ))}
                {inscripciones.length === 0 && <p style={{ color: '#9ca3af', fontSize: 14 }}>No tienes inscripciones activas</p>}
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: 16 }}><Badge text={rutaName(selectedInscripcion.rutaId)} color="#16a34a" /></div>
                <TabBar tabs={[{ key: 'pre', label: 'Ficha PRE' }, { key: 'post', label: 'Ficha POST' }]} active={fichaTab} onChange={setFichaTab} />
                {preguntas.data.filter(p => p.activa).map(p => (
                  <Card key={p.id} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 10 }}>{p.orden}. {p.texto}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[1, 2, 3, 4, 5].map(v => {
                        const sel = respuestas.find(r => r.preguntaId === p.id)?.valor === v
                        return <button key={v} onClick={() => setRespuesta(p.id, v)} style={{ width: 44, height: 44, borderRadius: 12, fontWeight: 700, fontSize: 16, border: sel ? '2px solid #16a34a' : '1.5px solid #d1d5db', background: sel ? '#16a34a' : '#fff', color: sel ? '#fff' : '#374151', transition: 'all .15s' }}>{v}</button>
                      })}
                    </div>
                  </Card>
                ))}
                {preguntas.data.filter(p => p.activa).length > 0 && (
                  <Btn onClick={fichaTab === 'pre' ? submitFichaPre : submitFichaPost} disabled={loading} style={{ width: '100%' }}>
                    {loading ? 'Enviando...' : `Enviar ficha ${fichaTab.toUpperCase()}`}
                  </Btn>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── AJUSTES ──────────────────────────────────────────────────────── */}
        {tab === 'ajustes' && (
          <div style={{ paddingTop: 16 }}>
            <BackBtn onBack={() => setTab('home')} />
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: '12px 0 20px' }}>Ajustes</h3>

            {/* Perfil */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, border: '1px solid #D4E2D8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#0D5C2F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 20, flexShrink: 0 }}>{inits}</div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 16, color: '#1A2318', margin: 0 }}>{student.nombreCompleto}</p>
                  <p style={{ fontSize: 13, color: '#627066', margin: '2px 0 0' }}>{student.correoInstitucional || student.correo || ''}</p>
                </div>
              </div>
              <div style={{ borderTop: '1px solid #F0F4F1' }}>
                {[['Identificacion', student.numeroIdentificacion], ['Programa', student.programaAcademico], ['Semestre', student.semestre], ['Sede', student.sede || '']].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F0F4F1' }}>
                    <span style={{ fontSize: 13, color: '#627066' }}>{k}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1A2318' }}>{v || '—'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inscripciones */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #D4E2D8' }}>
              <p style={{ fontWeight: 800, fontSize: 15, color: '#1A2318', marginBottom: 4 }}>Inscripciones a rutas</p>
              <p style={{ fontSize: 13, color: '#627066', marginBottom: 16 }}>Inscribete o cancela tu inscripcion a cada ruta disponible.</p>
              {rutas.filter(r => r.activa).length === 0
                ? <p style={{ fontSize: 13, color: '#627066' }}>No hay rutas disponibles.</p>
                : rutas.filter(r => r.activa).map(ruta => {
                  const inscActiva = inscripciones.find(i => i.rutaId === ruta.id)
                  return (
                    <div key={ruta.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 16px', borderRadius: 12, background: inscActiva ? '#E8F5ED' : '#F0F4F1', border: `1.5px solid ${inscActiva ? '#D4E2D8' : '#E5E7EB'}`, marginBottom: 10, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: 14, color: '#1A2318', margin: '0 0 2px' }}>{ruta.nombre}</p>
                        {ruta.descripcion && <p style={{ fontSize: 12, color: '#627066', margin: 0 }}>{ruta.descripcion}</p>}
                        {inscActiva && <span style={{ display: 'inline-block', marginTop: 4, fontSize: 11, fontWeight: 700, color: '#0D5C2F', background: '#C6E8D3', padding: '2px 8px', borderRadius: 20 }}>Inscrito</span>}
                      </div>
                      {inscActiva ? (
                        <button onClick={() => cancelarInscripcion(inscActiva.id, ruta.nombre)} disabled={inscribiendo} style={{ padding: '7px 14px', background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 9, fontWeight: 700, fontSize: 12, cursor: inscribiendo ? 'not-allowed' : 'pointer', flexShrink: 0 }}>
                          Cancelar
                        </button>
                      ) : (
                        <button onClick={() => inscribirseARuta(ruta.id)} disabled={inscribiendo} style={{ padding: '7px 14px', background: '#0D5C2F', color: '#fff', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: 12, cursor: inscribiendo ? 'not-allowed' : 'pointer', opacity: inscribiendo ? .7 : 1, flexShrink: 0 }}>
                          Inscribirse
                        </button>
                      )}
                    </div>
                  )
                })
              }
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
