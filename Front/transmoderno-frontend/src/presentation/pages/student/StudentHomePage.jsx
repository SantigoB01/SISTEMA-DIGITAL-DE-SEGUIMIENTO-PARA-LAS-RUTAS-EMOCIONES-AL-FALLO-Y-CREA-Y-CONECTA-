import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../../application/context/ToastContext'
import { useAsistencia, useFichas, usePreguntas } from '../../../application/hooks'
import { inscripcionRepo, rutaRepo, sesionRepo, alertaRepo } from '../../../infrastructure/repositories'
import { Card, Btn, Badge, TabBar } from '../../components/ui/index'
import Icon from '../../components/ui/Icon'

export default function StudentHomePage() {
  const nav = useNavigate()
  const toast = useToast()
  const asistencia = useAsistencia()
  const fichas = useFichas()
  const preguntas = usePreguntas()

  const [student, setStudent] = useState(null)
  const [inscripciones, setInscripciones] = useState([])
  const [rutas, setRutas] = useState([])
  const [sesionActiva, setSesionActiva] = useState(null)
  const [tab, setTab] = useState('home')
  const [loading, setLoading] = useState(false)
  const [fichaTab, setFichaTab] = useState('pre')
  const [selectedInscripcion, setSelectedInscripcion] = useState(null)
  const [respuestas, setRespuestas] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('tm_student')
    if (!saved) { nav('/student/enter'); return }
    const p = JSON.parse(saved)
    setStudent(p)
    loadData(p.numeroIdentificacion)
  }, [])

  const loadData = async (numero) => {
    try {
      const [inscs, rs] = await Promise.all([
        inscripcionRepo.findByParticipante(numero),
        rutaRepo.findAll()
      ])
      setInscripciones(inscs.filter(i => i.estado === 'ACTIVA'))
      setRutas(rs)

      const activas = inscs.filter(i => i.estado === 'ACTIVA')
      for (const insc of activas) {
        try {
          const s = await sesionRepo.findActiva(insc.rutaId)
          if (s && s.id) { setSesionActiva({ ...s, rutaId: insc.rutaId, inscripcionId: insc.id }); break }
        } catch {}
      }
    } catch {}
  }

  const rutaName = (id) => rutas.find(r => r.id === id)?.nombre || `Ruta ${id}`

  const registrarAsistencia = async () => {
    if (!sesionActiva) return
    setLoading(true)
    try {
      await asistencia.registrar(student.numeroIdentificacion, sesionActiva.rutaId)
    } catch {}
    setLoading(false)
  }

  const levantarMano = async () => {
    setLoading(true)
    try {
      await alertaRepo.crearSolicitud(student.numeroIdentificacion)
      toast('Solicitud enviada discretamente')
    } catch (e) {
      toast(e.mensaje || 'Error', 'error')
    }
    setLoading(false)
  }

  const setRespuesta = (preguntaId, valor) => {
    setRespuestas(prev => {
      const filtered = prev.filter(r => r.preguntaId !== preguntaId)
      return [...filtered, { preguntaId, valor }]
    })
  }

  const submitFichaPre = async () => {
    if (!selectedInscripcion) return
    setLoading(true)
    try {
      await fichas.crearPre({ inscripcionId: selectedInscripcion.id, respuestas })
      setRespuestas([])
      setTab('home')
    } catch {}
    setLoading(false)
  }

  const submitFichaPost = async () => {
    if (!selectedInscripcion) return
    setLoading(true)
    try {
      const pre = await fichas.obtenerPre(selectedInscripcion.id)
      await fichas.crearPost({ fichaPreId: pre.id, respuestas })
      setRespuestas([])
      setTab('home')
    } catch {}
    setLoading(false)
  }

  const selectInscripcionForFicha = (insc) => {
    setSelectedInscripcion(insc)
    preguntas.loadByRuta(insc.rutaId)
    setRespuestas([])
  }

  const changePerson = () => {
    localStorage.removeItem('tm_student')
    nav('/student/enter')
  }

  if (!student) return null

  return (
    <div>
      {/* Welcome */}
      <Card style={{marginBottom:20,background:'linear-gradient(135deg,#16a34a,#22c55e)',color:'#fff',border:'none'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8}}>
          <div>
            <div style={{fontSize:13,opacity:.85}}>Bienvenido/a,</div>
            <div style={{fontSize:20,fontWeight:700}}>{student.nombreCompleto}</div>
            <div style={{fontSize:12,opacity:.75,marginTop:2}}>{student.programaAcademico} · Sem. {student.semestre}</div>
          </div>
          {sesionActiva && <Badge text="Sesión activa hoy" color="#fff"/>}
        </div>
      </Card>

      {tab === 'home' && (
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {/* Registrar asistencia */}
          <Card onClick={sesionActiva ? registrarAsistencia : undefined}
            style={{cursor:sesionActiva?'pointer':'default',opacity:sesionActiva?1:.5}}>
            <div style={{display:'flex',alignItems:'center',gap:16}}>
              <div style={{width:44,height:44,borderRadius:12,background:'#f0faf0',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Icon name="check" size={22} color="#16a34a"/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:15,color:'#111'}}>Registrar asistencia</div>
                <div style={{fontSize:13,color:'#6b7280'}}>{sesionActiva ? `Sesión: ${sesionActiva.nombre}` : 'No hay sesión activa en este momento'}</div>
              </div>
              {loading && <span style={{fontSize:12,color:'#16a34a'}}>Registrando...</span>}
            </div>
          </Card>

          {/* Fichas */}
          <Card onClick={()=>setTab('fichas')} style={{cursor:'pointer'}}>
            <div style={{display:'flex',alignItems:'center',gap:16}}>
              <div style={{width:44,height:44,borderRadius:12,background:'#fef3c7',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Icon name="clipboard" size={22} color="#f59e0b"/>
              </div>
              <div>
                <div style={{fontWeight:700,fontSize:15,color:'#111'}}>Fichas PRE / POST</div>
                <div style={{fontSize:13,color:'#6b7280'}}>Cuestionario de seguimiento de bienestar</div>
              </div>
            </div>
          </Card>

          {/* Levantar la mano */}
          <Card onClick={levantarMano} style={{cursor:'pointer'}}>
            <div style={{display:'flex',alignItems:'center',gap:16}}>
              <div style={{width:44,height:44,borderRadius:12,background:'#ede9fe',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Icon name="hand" size={22} color="#7c3aed"/>
              </div>
              <div>
                <div style={{fontWeight:700,fontSize:15,color:'#111'}}>Levantar la mano</div>
                <div style={{fontSize:13,color:'#6b7280'}}>Solicita orientación de manera discreta</div>
              </div>
            </div>
          </Card>

          {/* Mis inscripciones */}
          {inscripciones.length > 0 && (
            <Card>
              <div style={{fontWeight:700,fontSize:15,color:'#111',marginBottom:12}}>Mis inscripciones activas</div>
              {inscripciones.map(i => (
                <div key={i.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid #f3f4f6'}}>
                  <span style={{fontSize:14,color:'#374151'}}>{rutaName(i.rutaId)}</span>
                  <Badge text="Activa" color="#16a34a"/>
                </div>
              ))}
            </Card>
          )}

          <button onClick={changePerson} style={{background:'none',border:'none',color:'#9ca3af',fontSize:13,textAlign:'center',marginTop:8,padding:8}}>
            No soy {student.nombreCompleto}
          </button>
        </div>
      )}

      {tab === 'fichas' && (
        <div>
          <Btn variant="ghost" size="sm" icon="chevL" onClick={()=>{setTab('home');setSelectedInscripcion(null);setRespuestas([])}}>Volver</Btn>
          <h3 style={{margin:'16px 0 12px',fontSize:18,fontWeight:700}}>Fichas de bienestar</h3>

          {!selectedInscripcion ? (
            <div>
              <p style={{fontSize:14,color:'#6b7280',marginBottom:16}}>Selecciona la inscripción para diligenciar la ficha:</p>
              {inscripciones.map(i => (
                <Card key={i.id} onClick={()=>selectInscripcionForFicha(i)} style={{cursor:'pointer',marginBottom:8}}>
                  <div style={{fontWeight:600,color:'#111'}}>{rutaName(i.rutaId)}</div>
                  <div style={{fontSize:12,color:'#6b7280'}}>Inscripción #{i.id}</div>
                </Card>
              ))}
              {inscripciones.length === 0 && <p style={{color:'#9ca3af',fontSize:14}}>No tienes inscripciones activas</p>}
            </div>
          ) : (
            <div>
              <div style={{marginBottom:16}}>
                <Badge text={rutaName(selectedInscripcion.rutaId)} color="#16a34a"/>
              </div>

              <TabBar tabs={[{key:'pre',label:'Ficha PRE'},{key:'post',label:'Ficha POST'}]} active={fichaTab} onChange={setFichaTab}/>

              {preguntas.data.filter(p=>p.activa).map(p => (
                <Card key={p.id} style={{marginBottom:12,padding:16}}>
                  <div style={{fontSize:14,fontWeight:600,color:'#374151',marginBottom:10}}>{p.orden}. {p.texto}</div>
                  <div style={{display:'flex',gap:8}}>
                    {[1,2,3,4,5].map(v => {
                      const sel = respuestas.find(r=>r.preguntaId===p.id)?.valor===v
                      return <button key={v} onClick={()=>setRespuesta(p.id,v)} style={{
                        width:44,height:44,borderRadius:12,fontWeight:700,fontSize:16,
                        border:sel?'2px solid #16a34a':'1.5px solid #d1d5db',
                        background:sel?'#16a34a':'#fff',color:sel?'#fff':'#374151',
                        transition:'all .15s'
                      }}>{v}</button>
                    })}
                  </div>
                </Card>
              ))}

              {preguntas.data.filter(p=>p.activa).length > 0 && (
                <Btn onClick={fichaTab==='pre'?submitFichaPre:submitFichaPost} disabled={loading} style={{width:'100%'}}>
                  {loading?'Enviando...':`Enviar ficha ${fichaTab.toUpperCase()}`}
                </Btn>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
