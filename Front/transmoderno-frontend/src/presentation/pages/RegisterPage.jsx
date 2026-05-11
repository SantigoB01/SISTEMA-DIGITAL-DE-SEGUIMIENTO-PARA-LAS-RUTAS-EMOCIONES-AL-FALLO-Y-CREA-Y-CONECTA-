import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../application/context/ToastContext'
import { participanteRepo } from '../../infrastructure/repositories'
import { AuthShell, Field, SubmitBtn, BackBtn } from './LoginEstudiantePage'

const PROGRAMAS = [
  'Ingeniería de Sistemas y Computación',
  'Ingeniería Electrónica',
  'Ingeniería Agronómica',
  'Administración de Empresas',
  'Contaduría Pública',
  'Zootecnia',
  'Música',
  'Licenciatura en Educación Básica',
  'Derecho',
  'Otro'
]

export default function RegisterPage() {
  const nav = useNavigate()
  const toast = useToast()
  const [paso, setPaso] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    numeroIdentificacion: '',
    nombreCompleto: '',
    correoInstitucional: '',
    programaAcademico: '',
    semestre: ''
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Paso 1: verificar si ya existe
  const verificar = async (e) => {
    e.preventDefault()
    if (!form.numeroIdentificacion.trim()) return
    setLoading(true)
    try {
      const p = await participanteRepo.findByIdentificacion(form.numeroIdentificacion.trim())
      if (p.activo) {
        toast(`¡Ya tienes cuenta! Ingresando como ${p.nombreCompleto.split(' ')[0]}...`)
        localStorage.setItem('tm_student', JSON.stringify(p))
        setTimeout(() => nav('/student/home'), 700)
      } else {
        toast('Tu cuenta está desactivada. Contacta al administrador.', 'error')
      }
    } catch {
      // No existe → continuar registro
      setPaso(2)
    }
    setLoading(false)
  }

  // Paso 2: crear cuenta
  const crear = async (e) => {
    e.preventDefault()
    if (!form.programaAcademico) { toast('Selecciona tu programa académico', 'error'); return }
    setLoading(true)
    try {
      const nuevo = await participanteRepo.save({
        numeroIdentificacion: form.numeroIdentificacion.trim(),
        nombreCompleto: form.nombreCompleto.trim(),
        correoInstitucional: form.correoInstitucional.trim().toLowerCase(),
        programaAcademico: form.programaAcademico,
        semestre: parseInt(form.semestre) || 1
      })
      toast('¡Cuenta creada! Bienvenido al Gimnasio Transmoderno.')
      localStorage.setItem('tm_student', JSON.stringify(nuevo))
      setTimeout(() => nav('/student/home'), 600)
    } catch (err) {
      toast(err.mensaje || 'Error al crear la cuenta. Intenta de nuevo.', 'error')
    }
    setLoading(false)
  }

  return (
    <AuthShell
      icon={paso === 1 ? '🔍' : '📝'}
      title={paso === 1 ? 'Verificar identificación' : 'Completar registro'}
      subtitle={paso === 1 ? 'Primero verifica si ya estás en el sistema' : 'Ingresa tus datos para crear tu cuenta'}
    >
      {/* Indicador de pasos */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:24 }}>
        {[1,2].map((n, i) => (
          <div key={n} style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{
              width:28, height:28, borderRadius:'50%',
              background: paso >= n ? '#16a34a' : '#f3f4f6',
              border: `2px solid ${paso >= n ? '#16a34a' : '#e8ece8'}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:12, fontWeight:700,
              color: paso >= n ? '#fff' : '#9ca3af'
            }}>{paso > n ? '✓' : n}</div>
            {i === 0 && <div style={{ width:40, height:2, background: paso > 1 ? '#16a34a' : '#e8ece8' }} />}
          </div>
        ))}
      </div>

      {paso === 1 && (
        <form onSubmit={verificar}>
          <Field
            label="Número de identificación"
            value={form.numeroIdentificacion}
            onChange={v => set('numeroIdentificacion', v)}
            placeholder="Ej: 1070464317"
            autoFocus required
          />
          <div style={{ background:'#f0faf0', borderRadius:10, padding:12, marginBottom:16, fontSize:12, color:'#374151', lineHeight:1.6 }}>
            💡 Si ya estás matriculado en UCundinamarca, ingresarás directamente sin llenar más datos.
          </div>
          <SubmitBtn loading={loading} text="Verificar" />
          <div style={{ textAlign:'center', marginTop:14, fontSize:13, color:'#6b7280' }}>
            ¿Ya tienes cuenta?{' '}
            <span onClick={() => nav('/login/estudiante')} style={{ color:'#16a34a', fontWeight:700, cursor:'pointer' }}>
              Ingresar
            </span>
          </div>
        </form>
      )}

      {paso === 2 && (
        <form onSubmit={crear}>
          <Field label="Identificación" value={form.numeroIdentificacion} onChange={() => {}} disabled />
          <Field
            label="Nombre completo"
            value={form.nombreCompleto}
            onChange={v => set('nombreCompleto', v)}
            placeholder="Nombres y apellidos completos"
            autoFocus required
          />
          <Field
            label="Correo institucional"
            type="email"
            value={form.correoInstitucional}
            onChange={v => set('correoInstitucional', v)}
            placeholder="usuario@ucundinamarca.edu.co"
            required
          />
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:6 }}>Programa académico</label>
            <select
              value={form.programaAcademico}
              onChange={e => set('programaAcademico', e.target.value)}
              style={{ width:'100%', padding:'11px 14px', fontSize:14, fontFamily:"'DM Sans',sans-serif", border:'1.5px solid #d1d5db', borderRadius:10, outline:'none', background:'#fafafa', boxSizing:'border-box' }}
            >
              <option value="">Selecciona tu programa...</option>
              {PROGRAMAS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <Field
            label="Semestre actual"
            type="number"
            value={form.semestre}
            onChange={v => set('semestre', v)}
            placeholder="Ej: 5"
            min="1" max="12" required
          />
          <div style={{ display:'flex', gap:8, marginTop:4 }}>
            <button type="button" onClick={() => setPaso(1)} style={{
              padding:'13px 18px', borderRadius:12, border:'1.5px solid #d1d5db',
              background:'#fff', fontSize:14, fontWeight:600, cursor:'pointer',
              fontFamily:"'DM Sans',sans-serif", color:'#6b7280'
            }}>← Atrás</button>
            <div style={{ flex:1 }}>
              <SubmitBtn loading={loading} text="Crear cuenta" />
            </div>
          </div>
        </form>
      )}

      <BackBtn onClick={() => nav('/')} />
    </AuthShell>
  )
}
