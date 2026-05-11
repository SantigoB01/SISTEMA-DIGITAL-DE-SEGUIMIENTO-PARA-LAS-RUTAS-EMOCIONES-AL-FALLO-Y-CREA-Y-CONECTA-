import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { login } from '../../api/authApi'

export default function LoginPage() {
    const { login: setAuth } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ correo: '', contrasena: '' })
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setCargando(true)
        setError('')
        try {
            const res = await login(form)
            setAuth(res.data.token, {
                nombre: res.data.nombre,
                correo: res.data.correo,
                rol: res.data.rol
            })
            navigate('/admin')
        } catch {
            setError('Correo o contraseña incorrectos')
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden"
             style={{
                background: 'linear-gradient(135deg, #064e3b 0%, #16a34a 55%, #4ade80 100%)',
                fontFamily: "'DM Sans', sans-serif"
             }}>
            {/* Decoración */}
            <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(255,255,255,.12) 0%, transparent 70%)' }} />
            <div className="absolute bottom-[-150px] left-[-150px] w-[500px] h-[500px] rounded-full pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(255,255,255,.08) 0%, transparent 70%)' }} />

            <div className="w-full max-w-sm relative z-10">
                {/* Header */}
                <div className="text-center mb-8 text-white">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 bg-white/95 shadow-2xl">
                        <span className="text-4xl font-bold"
                              style={{
                                  fontFamily: "'Playfair Display', serif",
                                  background: 'linear-gradient(135deg, #064e3b, #16a34a)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent'
                              }}>G</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight"
                        style={{ fontFamily: "'Playfair Display', serif" }}>
                        Gimnasio Transmoderno
                    </h1>
                    <p className="text-sm opacity-90 mt-1">Panel de administración</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3"
                             style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}>
                            <span className="text-2xl">🏥</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Personal del Gimnasio</h2>
                        <p className="text-sm text-gray-500 mt-1">Ingresa con tu correo institucional</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800">
                                {error}
                            </div>
                        )}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-600">Correo institucional</label>
                            <input type="email" required value={form.correo}
                                   onChange={e => setForm({ ...form, correo: e.target.value })}
                                   placeholder="admin@ucundinamarca.edu.co"
                                   className="border-2 border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 outline-none focus:border-green-600 focus:bg-white transition-all" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-600">Contraseña</label>
                            <input type="password" required value={form.contrasena}
                                   onChange={e => setForm({ ...form, contrasena: e.target.value })}
                                   placeholder="••••••••"
                                   className="border-2 border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 outline-none focus:border-green-600 focus:bg-white transition-all" />
                        </div>
                        <button type="submit" disabled={cargando}
                                className="rounded-xl py-3 text-sm font-bold text-white mt-3 disabled:opacity-60 transition-all hover:opacity-90 shadow-lg"
                                style={{
                                    background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                                    boxShadow: '0 4px 14px rgba(22,163,74,.3)'
                                }}>
                            {cargando ? 'Ingresando...' : 'Iniciar sesión'}
                        </button>
                    </form>

                    <div className="text-center mt-5">
                        <button onClick={() => navigate('/')}
                                className="text-xs text-gray-400 hover:text-gray-600 transition-all">
                            ← Volver al inicio
                        </button>
                    </div>
                </div>

                <p className="text-center mt-6 text-xs text-white/70">
                    Plataforma de Bienestar Universitario · UCundinamarca © 2026
                </p>
            </div>
        </div>
    )
}
