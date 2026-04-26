import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(() => {})
export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((msg, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts(p => [...p, { id, msg, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            padding: '12px 20px', borderRadius: 10, color: '#fff', fontSize: 14,
            background: t.type === 'error' ? '#dc2626' : '#16a34a',
            boxShadow: '0 4px 20px rgba(0,0,0,.15)', animation: 'slideIn .3s ease', maxWidth: 360
          }}>{t.msg}</div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
