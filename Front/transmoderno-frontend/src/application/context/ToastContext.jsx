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
            padding: '13px 20px', borderRadius: 12, color: '#fff', fontSize: 14, fontFamily: "'DM Sans', sans-serif",
            background: t.type === 'error' ? 'var(--gt-danger)' : t.type === 'warn' ? 'var(--gt-warn)' : 'var(--gt-primary)',
            boxShadow: '0 8px 24px rgba(0,0,0,.18)', animation: 'toastIn .3s ease', maxWidth: 380, fontWeight: 500,
            borderLeft: '4px solid rgba(255,255,255,.3)',
          }}>{t.type === 'error' ? '⚠ ' : t.type === 'warn' ? '⚡ ' : '✓ '}{t.msg}</div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
