import { createContext, useContext, useState, useCallback } from 'react'
import http from '../../infrastructure/api/httpClient'
import { usuarioRepo } from '../../infrastructure/repositories'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tm_user')
    if (saved) {
      const parsed = JSON.parse(saved)
      http.setToken(parsed.token)
      return parsed
    }
    return null
  })

  const login = useCallback(async (correo, contrasena) => {
    const res = await usuarioRepo.login(correo, contrasena)
    const userData = { token: res.token, nombre: res.nombre, correo: res.correo, rol: res.rol }
    http.setToken(res.token)
    localStorage.setItem('tm_user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }, [])

  const logout = useCallback(() => {
    http.clearToken()
    localStorage.removeItem('tm_user')
    setUser(null)
  }, [])

  const isAdmin = user?.rol === 'ADMIN'
  const isPsicologo = user?.rol === 'PSICOLOGO'
  const isEncargado = user?.rol === 'ENCARGADO'
  const isStaff = !!user?.token

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isPsicologo, isEncargado, isStaff }}>
      {children}
    </AuthContext.Provider>
  )
}
