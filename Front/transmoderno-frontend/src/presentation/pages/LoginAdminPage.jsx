import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../application/context/AuthContext'
import { useToast } from '../../application/context/ToastContext'
import { AuthShell, Field, SubmitBtn, BackBtn } from './LoginEstudiantePage'

export default function LoginAdminPage() {
  const nav = useNavigate()
  const { login } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState({ correo: '', contrasena: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.correo, form.contrasena)
      toast(`Bienvenido, ${user.nombre.split(' ')[0]}`)
      nav('/admin/dashboard')
    } catch (err) {
      toast(err.mensaje || 'Credenciales incorrectas. Verifica tu correo y contraseña.', 'error')
    }
    setLoading(false)
  }

  return (
    <AuthShell
      icon="🏥"
      title="Personal del Gimnasio"
      subtitle="Inicia sesión con tu correo institucional"
    >
      <form onSubmit={handleSubmit}>
        <Field
          label="Correo institucional"
          type="email"
          value={form.correo}
          onChange={v => setForm({ ...form, correo: v })}
          placeholder="usuario@ucundinamarca.edu.co"
          autoFocus
          required
        />
        <Field
          label="Contraseña"
          type="password"
          value={form.contrasena}
          onChange={v => setForm({ ...form, contrasena: v })}
          placeholder="••••••••"
          required
        />
        <SubmitBtn loading={loading} text="Iniciar sesión" />
      </form>
      <BackBtn onClick={() => nav('/')} />
    </AuthShell>
  )
}
