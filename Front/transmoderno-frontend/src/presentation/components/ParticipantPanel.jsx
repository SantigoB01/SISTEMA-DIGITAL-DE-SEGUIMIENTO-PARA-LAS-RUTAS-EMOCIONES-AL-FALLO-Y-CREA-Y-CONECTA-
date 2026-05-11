import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const EMOJIS = [
  { label: 'Mal', emoji: '😞' }, { label: 'Regular', emoji: '😕' },
  { label: 'Neutro', emoji: '😐' }, { label: 'Bien', emoji: '😊' },
  { label: 'Excelente', emoji: '😄' },
]

const S = {
  panel: { display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--gt-bg)' },
  headerBg: { background: 'var(--gt-primary)', padding: '20px 16px 28px', flexShrink: 0 },
  greeting: { color: 'rgba(255,255,255,.7)', fontSize: 13 },
  nameRow: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 },
  name: { color: '#fff', fontSize: 22, fontWeight: 800 },
  scroll: { flex: 1, overflowY: 'auto', padding: '0 12px 80px' },
  card: { background: '#fff', borderRadius: 12, border: '1px solid var(--gt-border)', marginBottom: 10 },
  cardPad: { padding: '14px 16px' },
  label: { fontSize: 10, fontWeight: 700, color: 'var(--gt-muted)', textTransform: 'uppercase', letterSpacing: 1 },
  bold: { fontWeight: 700, fontSize: 15, color: 'var(--gt-text)', marginTop: 2 },
  muted: { fontSize: 12, color: 'var(--gt-muted)', marginTop: 2 },
  emojiRow: { display: 'flex', justifyContent: 'space-between', marginTop: 10 },
  emojiBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, padding: 4, borderRadius: 8, transition: 'transform .15s' },
  handbtn: { width: '100%', background: 'var(--gt-accent)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginBottom: 10 },
  nav: { display: 'flex', borderTop: '1px solid var(--gt-border)', background: '#fff', position: 'absolute', bottom: 0, left: 0, right: 0 },
  navBtn: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 600 },
}

function ProfileField({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid var(--gt-border)' }}>
      <span style={{ color: 'var(--gt-muted)', fontSize: 13 }}>{label}</span>
      <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--gt-text)' }}>{value || '—'}</span>
    </div>
  )
}

export default function ParticipantPanel({ user }) {
  const [tab, setTab] = useState('home')
  const [selectedEmoji, setSelectedEmoji] = useState(null)
  const nav = useNavigate()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'
  const firstName = user?.nombre?.split(' ')[0] || 'Admin'

  return (
    <div style={{ ...S.panel, position: 'relative' }}>
      {/* Header */}
      <div style={S.headerBg}>
        <p style={S.greeting}>{greeting},</p>
        <div style={S.nameRow}>
          <h2 style={S.name}>{firstName}</h2>
          <span style={{ fontSize: 22 }}>👋</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 12, marginTop: 4 }}>
          {user?.rol || 'Staff'} · UCundinamarca
        </p>
      </div>

      {/* Content */}
      <div style={S.scroll}>
        {tab === 'home' && (
          <div style={{ marginTop: 12 }}>
            {/* Rutas del programa */}
            <div style={S.card}>
              <div style={{ ...S.cardPad, borderBottom: '1px solid var(--gt-border)' }}>
                <span style={S.label}>Programas activos</span>
              </div>
              {[
                { icon: '🔥', name: 'Emociones al Fallo', desc: 'Regulación emocional', color: '#FEF3DC' },
                { icon: '🎨', name: 'Crea y Conecta', desc: 'Creatividad y expresión', color: '#EDE9FE' },
              ].map(p => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid var(--gt-border)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{p.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--gt-text)' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--gt-muted)' }}>{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Solicitar ayuda */}
            <button style={S.handbtn} onClick={() => nav('/admin/alertas')}>
              <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>✋</div>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Ver solicitudes</div>
                <div style={{ fontSize: 11, opacity: .8 }}>Gestiona ayudas pendientes</div>
              </div>
              <span>→</span>
            </button>

            {/* Estado de ánimo (admin puede ver stats) */}
            <div style={{ ...S.card, ...S.cardPad }}>
              <span style={S.label}>¿Cómo está el equipo hoy?</span>
              <div style={S.emojiRow}>
                {EMOJIS.map(e => (
                  <button key={e.label} style={{
                    ...S.emojiBtn,
                    transform: selectedEmoji === e.label ? 'scale(1.3)' : 'scale(1)',
                    color: 'var(--gt-muted)',
                  }} onClick={() => setSelectedEmoji(e.label)}>
                    <span>{e.emoji}</span>
                    <span style={{ fontSize: 9 }}>{e.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Próximas sesiones */}
            <div style={{ ...S.card, ...S.cardPad }}>
              <span style={S.label}>Próxima sesión</span>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--gt-text)', marginTop: 8 }}>Mente y movimiento</div>
              <div style={{ fontSize: 12, color: 'var(--gt-muted)', marginTop: 3 }}>Jueves · 14:00 · Cancha C</div>
              <button onClick={() => nav('/admin/sesiones')} style={{
                marginTop: 10, padding: '7px 12px', background: 'var(--gt-primary-light)', border: 'none',
                borderRadius: 8, color: 'var(--gt-primary)', fontSize: 12, fontWeight: 700, cursor: 'pointer', width: '100%'
              }}>Ver todas las sesiones →</button>
            </div>
          </div>
        )}

        {tab === 'perfil' && (
          <div style={{ marginTop: 12 }}>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--gt-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: '#fff', fontWeight: 700, fontSize: 24 }}>
                {(user?.nombre || 'A').split(' ').slice(0, 2).map(n => n[0]).join('')}
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--gt-text)' }}>{user?.nombre}</div>
              <div style={{ fontSize: 12, color: 'var(--gt-muted)', marginTop: 2 }}>{user?.correo}</div>
            </div>
            <div style={{ ...S.card, overflow: 'hidden' }}>
              <ProfileField label="Rol" value={user?.rol} />
              <ProfileField label="Sede" value="Fusagasugá" />
              <ProfileField label="Universidad" value="UCundinamarca" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={S.nav}>
        {[
          { key: 'home', icon: '🏠', label: 'Inicio' },
          { key: 'perfil', icon: '👤', label: 'Perfil' },
        ].map(({ key, icon, label }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            ...S.navBtn,
            color: tab === key ? 'var(--gt-primary)' : 'var(--gt-muted)',
          }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
