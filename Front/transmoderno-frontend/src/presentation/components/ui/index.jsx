// ── GT Design System UI Components ─────────────────────────────────────────

// PageHeader
export function PageHeader({ title, subtitle, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--gt-text)', margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13, color: 'var(--gt-muted)', marginTop: 3 }}>{subtitle}</p>}
      </div>
      {children && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{children}</div>}
    </div>
  )
}

// StatCard
export function StatCard({ label, value, sub, color = 'var(--gt-primary)', icon }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid var(--gt-border)', boxShadow: 'var(--gt-shadow-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--gt-muted)', textTransform: 'uppercase', letterSpacing: 1.5 }}>{label}</p>
        {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
      </div>
      <p style={{ fontSize: 30, fontWeight: 800, color, lineHeight: 1.1 }}>{value}</p>
      {sub && <p style={{ fontSize: 12, color: 'var(--gt-muted)', marginTop: 4 }}>{sub}</p>}
    </div>
  )
}

// Badge
export function Badge({ text, color = 'var(--gt-primary)', bg }) {
  const bgColor = bg || (color === 'var(--gt-primary)' ? 'var(--gt-primary-light)' : color + '18')
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
      background: bgColor, color,
    }}>
      {text}
    </span>
  )
}

// Btn
export function Btn({ children, onClick, disabled, variant = 'primary', size = 'md', type = 'button', style: extraStyle = {}, icon }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700, borderRadius: 10, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? .6 : 1, transition: 'all .15s', whiteSpace: 'nowrap',
  }
  const sizes = {
    sm: { padding: '5px 10px', fontSize: 12 },
    md: { padding: '8px 16px', fontSize: 13 },
    lg: { padding: '12px 22px', fontSize: 15 },
  }
  const variants = {
    primary:   { background: 'var(--gt-primary)', color: '#fff' },
    secondary: { background: 'var(--gt-primary-light)', color: 'var(--gt-primary)', border: '1px solid var(--gt-border)' },
    danger:    { background: '#FEE2E2', color: 'var(--gt-danger)' },
    ghost:     { background: 'transparent', color: 'var(--gt-muted)', border: '1px solid var(--gt-border)' },
    accent:    { background: 'var(--gt-accent)', color: '#fff' },
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ ...base, ...sizes[size] || sizes.md, ...variants[variant] || variants.primary, ...extraStyle }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = '.85' }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
      {icon && <BtnIcon name={icon} />}
      {children}
    </button>
  )
}

function BtnIcon({ name }) {
  const icons = {
    plus: '+', search: '🔍', edit: '✏', trash: '🗑', chart: '📊',
    check: '✓', bell: '🔔', shield: '🛡', logout: '🚪', download: '⬇',
    users: '👥', calendar: '📅', clipboard: '📋', chevL: '‹', route: '🗺', hand: '✋',
  }
  return <span style={{ fontSize: 14, lineHeight: 1 }}>{icons[name] || ''}</span>
}

// Input
export function Input({ label, value, onChange, type = 'text', placeholder, disabled, required, style: extraStyle = {}, onKeyDown, autoFocus, min, max }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gt-text)', marginBottom: 6 }}>{label}</label>}
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        disabled={disabled} required={required} onKeyDown={onKeyDown} autoFocus={autoFocus}
        min={min} max={max}
        style={{
          width: '100%', padding: '9px 13px', fontSize: 14, fontFamily: "'DM Sans', sans-serif",
          border: '1.5px solid var(--gt-border)', borderRadius: 9, outline: 'none',
          background: disabled ? 'var(--gt-bg)' : '#fff', color: 'var(--gt-text)',
          transition: 'border-color .2s', boxSizing: 'border-box', ...extraStyle,
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--gt-primary)' }}
        onBlur={e => { e.target.style.borderColor = 'var(--gt-border)' }}
      />
    </div>
  )
}

// Select
export function Select({ label, value, onChange, options = [], children, style: extraStyle = {} }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gt-text)', marginBottom: 6 }}>{label}</label>}
      <select value={value} onChange={onChange}
        style={{
          width: '100%', padding: '9px 13px', fontSize: 14, fontFamily: "'DM Sans', sans-serif",
          border: '1.5px solid var(--gt-border)', borderRadius: 9, outline: 'none',
          background: '#fff', color: 'var(--gt-text)', cursor: 'pointer', ...extraStyle,
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--gt-primary)' }}
        onBlur={e => { e.target.style.borderColor = 'var(--gt-border)' }}>
        {children || options.map(o => (
          <option key={o.value || o} value={o.value !== undefined ? o.value : o}>
            {o.label || o}
          </option>
        ))}
      </select>
    </div>
  )
}

// Table
export function Table({ columns = [], data = [], actions }) {
  if (!data.length) return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--gt-border)', padding: '40px', textAlign: 'center', color: 'var(--gt-muted)', fontSize: 14 }}>
      No hay registros
    </div>
  )
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--gt-border)', overflow: 'hidden', boxShadow: 'var(--gt-shadow-sm)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--gt-border)', background: 'var(--gt-bg)' }}>
            {columns.map(c => (
              <th key={c.key} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--gt-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                {c.label}
              </th>
            ))}
            {actions && <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: 'var(--gt-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, ri) => (
            <tr key={row.id || ri} style={{ borderBottom: ri < data.length - 1 ? '1px solid var(--gt-border)' : 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--gt-bg)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '' }}>
              {columns.map(c => (
                <td key={c.key} style={{ padding: '10px 14px', color: c.muted ? 'var(--gt-muted)' : 'var(--gt-text)' }}>
                  {c.render ? c.render(row[c.key], row) : (row[c.key] ?? '—')}
                </td>
              ))}
              {actions && <td style={{ padding: '10px 14px', textAlign: 'right' }}>{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Pagination
export function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 16, padding: '8px 0' }}>
      <Btn size="sm" variant="ghost" disabled={page <= 0} onClick={() => onChange(page - 1)}>‹ Anterior</Btn>
      <span style={{ fontSize: 13, color: 'var(--gt-muted)' }}>Pág. {page + 1} / {totalPages}</span>
      <Btn size="sm" variant="ghost" disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)}>Siguiente ›</Btn>
    </div>
  )
}

// Card
export function Card({ children, style: extraStyle = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: '#fff', borderRadius: 14, border: '1px solid var(--gt-border)',
      padding: 20, boxShadow: 'var(--gt-shadow-sm)',
      cursor: onClick ? 'pointer' : 'default', transition: 'box-shadow .2s',
      ...extraStyle,
    }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.boxShadow = 'var(--gt-shadow-md)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--gt-shadow-sm)' }}>
      {children}
    </div>
  )
}

// Modal
export function Modal({ open, onClose, title, children, width = 520 }) {
  if (!open) return null
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 20,
      background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(2px)',
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 18, width: '100%', maxWidth: width,
        maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,.2)',
      }} onClick={e => e.stopPropagation()}>
        {title && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid var(--gt-border)' }}>
            <h3 style={{ fontWeight: 800, fontSize: 17, color: 'var(--gt-text)', margin: 0 }}>{title}</h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--gt-muted)', lineHeight: 1 }}>✕</button>
          </div>
        )}
        <div style={{ padding: 22 }}>{children}</div>
      </div>
    </div>
  )
}

// TabBar
export function TabBar({ tabs = [], active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, background: 'var(--gt-bg)', borderRadius: 10, padding: 4, marginBottom: 20, border: '1px solid var(--gt-border)' }}>
      {tabs.map(t => (
        <button key={t.key} onClick={() => onChange(t.key)} style={{
          flex: 1, padding: '7px 12px', borderRadius: 8, border: 'none',
          background: active === t.key ? '#fff' : 'transparent',
          color: active === t.key ? 'var(--gt-primary)' : 'var(--gt-muted)',
          fontWeight: active === t.key ? 700 : 500, fontSize: 13,
          cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          boxShadow: active === t.key ? 'var(--gt-shadow-sm)' : 'none',
          transition: 'all .15s',
        }}>{t.label}</button>
      ))}
    </div>
  )
}

// Spinner
export function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--gt-border)', borderTopColor: 'var(--gt-primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// Textarea
export function Textarea({ label, value, onChange, placeholder, rows = 3, disabled, style: extraStyle = {} }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gt-text)', marginBottom: 6 }}>{label}</label>}
      <textarea
        value={value} onChange={onChange} placeholder={placeholder} rows={rows} disabled={disabled}
        style={{
          width: '100%', padding: '9px 13px', fontSize: 14, fontFamily: "'DM Sans', sans-serif",
          border: '1.5px solid var(--gt-border)', borderRadius: 9, outline: 'none', resize: 'vertical',
          background: disabled ? 'var(--gt-bg)' : '#fff', color: 'var(--gt-text)',
          transition: 'border-color .2s', boxSizing: 'border-box', ...extraStyle,
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--gt-primary)' }}
        onBlur={e => { e.target.style.borderColor = 'var(--gt-border)' }}
      />
    </div>
  )
}
