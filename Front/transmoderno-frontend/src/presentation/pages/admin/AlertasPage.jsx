import { useState, useEffect } from 'react'
import { useAlertas } from '../../../application/hooks'
import { Btn, Table, Pagination, PageHeader, Badge, Card } from '../../components/ui/index'

// ── Colores y etiquetas de nivel de riesgo ─────────────────────────────────
const NIVEL = {
  LEVE:     { color: '#f59e0b', bg: '#fef3c7', label: 'Leve',     desc: '2–3 sesiones sin asistir' },
  MODERADO: { color: '#f97316', bg: '#ffedd5', label: 'Moderado', desc: '4–5 sesiones sin asistir' },
  ALTO:     { color: '#dc2626', bg: '#fee2e2', label: 'Alto',     desc: '6+ sesiones o nunca asistió' },
}

function NivelBadge({ nivel }) {
  const n = NIVEL[nivel] || NIVEL.LEVE
  return (
    <span title={n.desc} style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
      background: n.bg, color: n.color, fontFamily: "'DM Sans', sans-serif"
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: n.color, display: 'inline-block' }} />
      {n.label}
    </span>
  )
}

// ── Resumen de niveles ─────────────────────────────────────────────────────
function ResumenNiveles({ data }) {
  const counts = { LEVE: 0, MODERADO: 0, ALTO: 0 }
  data.forEach(d => { if (counts[d.nivelRiesgo] !== undefined) counts[d.nivelRiesgo]++ })

  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
      {Object.entries(NIVEL).map(([key, n]) => (
        <Card key={key} style={{ flex: 1, minWidth: 140, padding: '16px 20px', borderLeft: `4px solid ${n.color}` }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: n.color }}>{counts[key]}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{n.label}</div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{n.desc}</div>
        </Card>
      ))}
    </div>
  )
}

// ── Tarjeta de solicitud de ayuda ──────────────────────────────────────────
function SolicitudCard({ solicitud, onAtender, atendiendo }) {
  const pendiente = !solicitud.atendida
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '16px 20px',
      border: `1.5px solid ${pendiente ? '#fde68a' : '#e8ece8'}`,
      borderLeft: `4px solid ${pendiente ? '#f59e0b' : '#16a34a'}`,
      display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
      boxShadow: pendiente ? '0 2px 8px rgba(245,158,11,.1)' : '0 1px 3px rgba(0,0,0,.04)'
    }}>
      {/* Ícono de estado */}
      <div style={{
        width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
        background: pendiente ? '#fef3c7' : '#f0faf0',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
      }}>
        {pendiente ? '✋' : '✅'}
      </div>

      {/* Info participante */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>
          {solicitud.nombreCompleto || `Participante #${solicitud.participanteId}`}
        </div>
        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
          ID: {solicitud.numeroIdentificacion || solicitud.participanteId}
          {' · '}
          {solicitud.fechaHora ? new Date(solicitud.fechaHora).toLocaleString('es-CO', {
            dateStyle: 'short', timeStyle: 'short'
          }) : '—'}
        </div>
      </div>

      {/* Estado + botón */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {pendiente ? (
          <button
            onClick={() => onAtender(solicitud.id)}
            disabled={atendiendo === solicitud.id}
            style={{
              padding: '9px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: '#16a34a', color: '#fff', fontWeight: 700, fontSize: 13,
              fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: 6,
              opacity: atendiendo === solicitud.id ? 0.6 : 1, transition: 'all .2s',
              boxShadow: '0 2px 8px rgba(22,163,74,.25)'
            }}
          >
            {atendiendo === solicitud.id ? 'Marcando...' : '✓ Marcar atendida'}
          </button>
        ) : (
          <div style={{ textAlign: 'right' }}>
            <Badge text="Atendida" color="#16a34a" />
            {solicitud.fechaAtencion && (
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 3 }}>
                {new Date(solicitud.fechaAtencion).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Página principal ────────────────────────────────────────────────────────
export default function AlertasPage() {
  const al = useAlertas()
  const [tab, setTab] = useState('solicitudes')
  const [filtroNivel, setFiltroNivel] = useState('TODOS')
  const [atendiendo, setAtendiendo] = useState(null)
  const [filtroPendientes, setFiltroPendientes] = useState(false)

  const pendientesCount = al.solicitudes.filter(s => !s.atendida).length

  const handleAtender = async (id) => {
    setAtendiendo(id)
    try { await al.atender(id) } catch {}
    setAtendiendo(null)
  }

  const inasistenciasFiltradas = filtroNivel === 'TODOS'
    ? al.inasistencias
    : al.inasistencias.filter(i => i.nivelRiesgo === filtroNivel)

  const solicitudesFiltradas = filtroPendientes
    ? al.solicitudes.filter(s => !s.atendida)
    : al.solicitudes

  const TABS = [
    {
      key: 'solicitudes',
      label: `Solicitudes de ayuda${pendientesCount > 0 ? ` (${pendientesCount} pendientes)` : ''}`
    },
    {
      key: 'inasistencias',
      label: `Inasistencias (${al.inasistencias.length})`
    }
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <PageHeader title="Alertas" subtitle="Seguimiento de solicitudes y ausentismo" />

      {/* Tab selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '9px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
            transition: 'all .18s',
            background: tab === t.key ? '#16a34a' : '#f0faf0',
            color: tab === t.key ? '#fff' : '#374151',
            boxShadow: tab === t.key ? '0 2px 8px rgba(22,163,74,.2)' : 'none'
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── SOLICITUDES DE AYUDA ──────────────────────────────────────── */}
      {tab === 'solicitudes' && (
        <div>
          {/* Filtro rápido */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
            <button onClick={() => setFiltroPendientes(!filtroPendientes)} style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              border: `1.5px solid ${filtroPendientes ? '#f59e0b' : '#d1d5db'}`,
              background: filtroPendientes ? '#fef3c7' : '#fff',
              color: filtroPendientes ? '#92400e' : '#6b7280',
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
            }}>
              {filtroPendientes ? '✅ Solo pendientes' : '☐ Mostrar solo pendientes'}
            </button>
            <span style={{ fontSize: 13, color: '#9ca3af' }}>
              {solicitudesFiltradas.length} solicitudes
            </span>
          </div>

          {/* Cards de solicitudes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {solicitudesFiltradas.length === 0 ? (
              <Card style={{ textAlign: 'center', padding: 48 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#374151' }}>Sin solicitudes pendientes</div>
                <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>
                  Todas las solicitudes han sido atendidas
                </div>
              </Card>
            ) : (
              solicitudesFiltradas.map(s => (
                <SolicitudCard
                  key={s.id}
                  solicitud={s}
                  onAtender={handleAtender}
                  atendiendo={atendiendo}
                />
              ))
            )}
          </div>

          <Pagination page={al.solPage} totalPages={al.solTotalPages} onChange={p => al.loadSolicitudes(p)} />
        </div>
      )}

      {/* ── INASISTENCIAS ─────────────────────────────────────────────── */}
      {tab === 'inasistencias' && (
        <div>
          {/* Resumen por nivel */}
          <ResumenNiveles data={al.inasistencias} />

          {/* Filtro por nivel */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {['TODOS', 'ALTO', 'MODERADO', 'LEVE'].map(n => {
              const info = n === 'TODOS' ? { color: '#374151', bg: '#f3f4f6', label: 'Todos' } : NIVEL[n]
              const active = filtroNivel === n
              return (
                <button key={n} onClick={() => setFiltroNivel(n)} style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  border: `1.5px solid ${active ? info.color : '#d1d5db'}`,
                  background: active ? info.bg : '#fff',
                  color: active ? info.color : '#6b7280',
                  cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
                }}>
                  {info.label} {n !== 'TODOS' && `(${al.inasistencias.filter(i => i.nivelRiesgo === n).length})`}
                </button>
              )
            })}
            <span style={{ fontSize: 13, color: '#9ca3af', alignSelf: 'center' }}>
              {inasistenciasFiltradas.length} participantes
            </span>
          </div>

          {/* Tabla de inasistencias */}
          <div style={{ borderRadius: 12, border: '1px solid #e8ece8', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
              <thead>
                <tr style={{ background: '#f0faf0' }}>
                  {['Nivel', 'Participante', 'Identificación', 'Ruta', 'Sesiones faltadas', 'Última asistencia', 'Días sin asistir'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#374151', borderBottom: '1px solid #e8ece8', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inasistenciasFiltradas.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: 48, textAlign: 'center', color: '#9ca3af' }}>
                    Sin alertas para el nivel seleccionado
                  </td></tr>
                )}
                {inasistenciasFiltradas.map((a, i) => (
                  <tr key={`${a.participanteId}-${a.rutaId}`}
                    style={{ borderBottom: '1px solid #f3f4f6', background: a.nivelRiesgo === 'ALTO' ? '#fff5f5' : a.nivelRiesgo === 'MODERADO' ? '#fffbeb' : '#fff' }}>
                    <td style={{ padding: '12px 16px' }}><NivelBadge nivel={a.nivelRiesgo} /></td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#111' }}>{a.nombreCompleto}</td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>{a.numeroIdentificacion}</td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>{a.nombreRuta}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={{
                        fontWeight: 800, fontSize: 18,
                        color: a.nivelRiesgo === 'ALTO' ? '#dc2626' : a.nivelRiesgo === 'MODERADO' ? '#f97316' : '#f59e0b'
                      }}>
                        {a.sessionesFaltadas ?? a.diasSinAsistir === -1 ? '∞' : a.sessionesFaltadas}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>
                      {a.ultimaAsistencia
                        ? new Date(a.ultimaAsistencia).toLocaleDateString('es-CO')
                        : <span style={{ color: '#dc2626', fontWeight: 600 }}>Nunca</span>}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>
                      {a.diasSinAsistir === -1 ? '—' : `${a.diasSinAsistir} días`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
