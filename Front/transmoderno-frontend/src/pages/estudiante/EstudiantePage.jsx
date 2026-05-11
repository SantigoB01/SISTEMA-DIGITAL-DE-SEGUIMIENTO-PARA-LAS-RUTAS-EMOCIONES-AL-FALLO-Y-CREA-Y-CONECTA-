import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { buscarPorIdentificacion, buscarEnUcundinamarca } from '../../api/participantesApi'
import api from '../../api/axios'
import RegistroPage from './RegistroPage'
import AsistenciaPage from './AsistenciaPage'
import FichasPage from './FichasPage'
import AyudaPage from './AyudaPage'
import PerfilPage from './PerfilPage'
import GatoAsistente from '../../components/GatoAsistente'

// ─── Estilo base verde gradiente ─────────────────────────────────
const fondoGradiente = {
    background: 'linear-gradient(135deg, #064e3b 0%, #16a34a 55%, #4ade80 100%)',
    fontFamily: "'DM Sans', sans-serif",
}

const decoracion = (
    <>
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle, rgba(255,255,255,.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-150px] left-[-150px] w-[500px] h-[500px] rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle, rgba(255,255,255,.08) 0%, transparent 70%)' }} />
    </>
)

export default function EstudiantePage() {
    const [participante, setParticipante] = useState(null)
    const [estudianteUcundinamarca, setEstudianteUcundinamarca] = useState(null)
    const [inscripciones, setInscripciones] = useState([])
    const [vista, setVista] = useState('bienvenida')   // bienvenida → identificacion → confirmacion / inicio
    const [numeroId, setNumeroId] = useState('')
    const [buscando, setBuscando] = useState(false)
    const [error, setError] = useState('')

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const sesionIdQR = searchParams.get('sesion')

    const handleIdentificar = async (e) => {
        e.preventDefault()
        setBuscando(true)
        setError('')
        try {
            const res = await buscarPorIdentificacion(numeroId)
            setParticipante(res.data)
            try {
                const resInscripciones = await api.get(`/inscripciones/participante/${numeroId}`)
                setInscripciones(resInscripciones.data)
            } catch {
                setInscripciones([])
            }
            setVista('inicio')
        } catch {
            try {
                const resUcu = await buscarEnUcundinamarca(numeroId)
                setEstudianteUcundinamarca(resUcu.data)
                setVista('confirmacion')
            } catch {
                setEstudianteUcundinamarca(null)
                setVista('noEncontrado')
            }
        } finally {
            setBuscando(false)
        }
    }

    const handleRegistroExitoso = (datos) => {
        setParticipante(datos)
        setVista('inicio')
    }

    // Vistas internas (mantienen su lógica original)
    if (vista === 'confirmacion') return (
        <RegistroPage
            numeroIdentificacion={numeroId}
            datosUcundinamarca={estudianteUcundinamarca}
            onExito={handleRegistroExitoso}
            onVolver={() => setVista('identificacion')}
        />
    )
    if (vista === 'registro') return (
        <RegistroPage
            numeroIdentificacion={numeroId}
            datosUcundinamarca={null}
            onExito={handleRegistroExitoso}
            onVolver={() => setVista('noEncontrado')}
        />
    )
    if (vista === 'asistencia') return (
        <AsistenciaPage
            participante={participante}
            sesionIdQR={sesionIdQR}
            onVolver={() => setVista('inicio')}
        />
    )
    if (vista === 'fichas')  return <FichasPage participante={participante} onVolver={() => setVista('inicio')} />
    if (vista === 'ayuda')   return <AyudaPage participante={participante} onVolver={() => setVista('inicio')} />
    if (vista === 'perfil')  return (
        <PerfilPage
            participante={participante}
            onVolver={() => setVista('inicio')}
            onActualizar={(d) => setParticipante(d)}
        />
    )

    // ─── Vista 1: Bienvenida con tarjetas (estilo nuestro) ───────────
    if (vista === 'bienvenida') {
        return (
            <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden" style={fondoGradiente}>
                {decoracion}
                <div className="w-full max-w-3xl relative z-10">

                    {/* Header */}
                    <div className="text-center mb-10 text-white">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-5 bg-white/95 shadow-2xl">
                            <span className="text-4xl font-bold"
                                  style={{
                                      fontFamily: "'Playfair Display', serif",
                                      background: 'linear-gradient(135deg, #064e3b, #16a34a)',
                                      WebkitBackgroundClip: 'text',
                                      WebkitTextFillColor: 'transparent'
                                  }}>G</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Gimnasio Transmoderno
                        </h1>
                        <p className="text-base opacity-90 mt-2 font-light">Universidad de Cundinamarca · Bienestar Universitario</p>
                    </div>

                    {/* Tarjetas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RoleCard
                            icon="🎓"
                            tag="Participantes"
                            title="Soy Estudiante"
                            desc="Registra tu asistencia, completa fichas de bienestar y solicita orientación."
                            primaryLabel="Ingresar con mi cédula →"
                            onPrimary={() => setVista('identificacion')}
                        />
                        <RoleCard
                            icon="🏥"
                            tag="Administración"
                            title="Personal del Gimnasio"
                            desc="Psicólogos, encargados y administradores del sistema."
                            primaryLabel="Iniciar sesión"
                            onPrimary={() => navigate('/admin/login')}
                        />
                    </div>

                    <p className="text-center mt-10 text-xs text-white/70">
                        Plataforma de Bienestar Universitario · UCundinamarca © 2026
                    </p>
                </div>
            </div>
        )
    }

    // ─── Vista 2: Ingresar cédula ────────────────────────────────────
    if (vista === 'identificacion' || !vista) {
        return (
            <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden" style={fondoGradiente}>
                {decoracion}
                <div className="w-full max-w-md relative z-10">
                    <div className="text-center mb-6 text-white">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-white/95 shadow-xl">
                            <span className="text-3xl font-bold"
                                  style={{
                                      fontFamily: "'Playfair Display', serif",
                                      background: 'linear-gradient(135deg, #064e3b, #16a34a)',
                                      WebkitBackgroundClip: 'text',
                                      WebkitTextFillColor: 'transparent'
                                  }}>G</span>
                        </div>
                        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Gimnasio Transmoderno
                        </h1>
                        <p className="text-sm opacity-90 mt-1">UCundinamarca · Fusagasugá</p>
                    </div>

                    <div className="bg-white rounded-3xl p-7 shadow-2xl">
                        {sesionIdQR && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800 text-center mb-4">
                                📷 Escaneaste el QR de una sesión. Ingresa tu número para registrar asistencia.
                            </div>
                        )}

                        <div className="text-center mb-5">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3"
                                 style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}>
                                <span className="text-2xl">🎓</span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Ingresa al Gimnasio</h2>
                            <p className="text-sm text-gray-500 mt-1">Escribe tu número de identificación</p>
                        </div>

                        <form onSubmit={handleIdentificar} className="flex flex-col gap-3">
                            {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800">{error}</div>}
                            <input
                                type="text"
                                value={numeroId}
                                onChange={(e) => setNumeroId(e.target.value)}
                                placeholder="Ej. 1070464317"
                                required autoFocus
                                className="border-2 border-gray-200 rounded-xl px-4 py-3 text-base bg-gray-50 outline-none focus:border-green-600 focus:bg-white text-center transition-all"
                            />
                            <button type="submit" disabled={buscando}
                                    className="rounded-xl py-3 text-sm font-bold text-white disabled:opacity-60 transition-all hover:opacity-90 shadow-lg"
                                    style={{
                                        background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                                        boxShadow: '0 4px 14px rgba(22,163,74,.3)'
                                    }}>
                                {buscando ? 'Buscando...' : 'Continuar →'}
                            </button>
                        </form>

                        <div className="text-center mt-5">
                            <button onClick={() => setVista('bienvenida')}
                                    className="text-xs text-gray-400 hover:text-gray-600 transition-all">
                                ← Volver al inicio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // ─── No encontrado ───────────────────────────────────────────────
    if (vista === 'noEncontrado') {
        return (
            <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden" style={fondoGradiente}>
                {decoracion}
                <div className="w-full max-w-md relative z-10">
                    <div className="bg-white rounded-3xl p-7 shadow-2xl">
                        <div className="text-center mb-5">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3 bg-yellow-100">
                                <span className="text-3xl">🔍</span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">No te encontramos</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                El número <strong>{numeroId}</strong> no está en el sistema
                            </p>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800 mb-4">
                            ¿Es tu primera vez en el Gimnasio? Puedes crear tu cuenta llenando un formulario.
                        </div>

                        <div className="flex flex-col gap-3">
                            <button onClick={() => setVista('registro')}
                                    className="rounded-xl py-3 text-sm font-bold text-white transition-all hover:opacity-90 shadow-lg"
                                    style={{
                                        background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                                        boxShadow: '0 4px 14px rgba(22,163,74,.3)'
                                    }}>
                                Registrarme manualmente
                            </button>
                            <button onClick={() => setVista('identificacion')}
                                    className="border-2 border-gray-200 text-gray-600 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 transition-all">
                                Intentar con otro número
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // ─── Vista 3: Inicio del estudiante (con opciones) ───────────────
    if (vista === 'inicio') {
        return (
            <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden" style={fondoGradiente}>
                {decoracion}
                <div className="w-full max-w-md relative z-10">

                    {/* Header del estudiante */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="px-6 py-7 text-center text-white relative"
                             style={{ background: 'linear-gradient(135deg, #064e3b, #16a34a)' }}>
                            <button
                                onClick={() => setVista('perfil')}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
                                title="Mi perfil">
                                👤
                            </button>
                            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Gimnasio Transmoderno
                            </h1>
                            <p className="text-green-200 text-sm mt-1">UCundinamarca · Fusagasugá</p>
                            <span className="inline-block mt-3 bg-white/15 text-green-100 text-xs px-4 py-1 rounded-full border border-white/20">
                                Sesión activa hoy
                            </span>
                        </div>

                        <div className="p-5 flex flex-col gap-3">
                            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-900">
                                Bienvenido/a, <strong>{participante.nombreCompleto}</strong>
                            </div>

                            {sesionIdQR && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800">
                                    📷 Llegaste desde un código QR. Puedes registrar tu asistencia directamente.
                                </div>
                            )}

                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">
                                Opciones disponibles
                            </p>

                            <OptionCard icon="✅" iconBg="bg-orange-50" titulo="Registrar asistencia"
                                        descripcion="Confirma tu presencia en la sesión de hoy"
                                        onClick={() => setVista('asistencia')} />
                            <OptionCard icon="📝" iconBg="bg-blue-50" titulo="Fichas PRE / POST"
                                        descripcion="Cuestionario de seguimiento de bienestar"
                                        onClick={() => setVista('fichas')} />
                            <OptionCard icon="🙋" iconBg="bg-red-50" titulo="Levantar la mano"
                                        descripcion="Solicita orientación de manera discreta"
                                        onClick={() => setVista('ayuda')} />

                            <button onClick={() => {
                                setParticipante(null)
                                setNumeroId('')
                                setInscripciones([])
                                setVista('bienvenida')
                            }}
                                    className="text-xs text-gray-400 mt-3 hover:text-gray-600 transition-all py-1">
                                No soy {participante.nombreCompleto?.split(' ')[0]} · Cerrar sesión
                            </button>
                        </div>
                    </div>

                    <GatoAsistente
                        participante={participante}
                        inscripciones={inscripciones}
                        onNavegar={(v) => setVista(v)}
                    />
                </div>
            </div>
        )
    }

    return null
}

// ─── Componentes ────────────────────────────────────────────────
function RoleCard({ icon, tag, title, desc, primaryLabel, onPrimary }) {
    return (
        <div className="bg-white rounded-3xl p-7 shadow-2xl transition-all hover:-translate-y-1 hover:shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                     style={{ background: 'linear-gradient(135deg, #f0faf0, #dcfce7)' }}>{icon}</div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-green-600">{tag}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">{desc}</p>
            <button onClick={onPrimary}
                    className="w-full rounded-xl py-3 text-sm font-bold text-white transition-all hover:opacity-90 shadow-lg"
                    style={{
                        background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                        boxShadow: '0 4px 14px rgba(22,163,74,.3)'
                    }}>
                {primaryLabel}
            </button>
        </div>
    )
}

function OptionCard({ icon, iconBg, titulo, descripcion, onClick }) {
    return (
        <div onClick={onClick}
             className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 active:scale-[.98] transition-all">
            <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>{icon}</div>
            <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{titulo}</p>
                <p className="text-xs text-gray-500 mt-0.5">{descripcion}</p>
            </div>
            <span className="text-gray-300 text-xl">›</span>
        </div>
    )
}
