import { useState, useEffect } from 'react'
import { useAlertas } from '../../../application/hooks'
import { Btn, Table, Pagination, PageHeader, Badge, Card, TabBar } from '../../components/ui/index'

// ── Niveles de riesgo por inasistencia ─────────────────────────────────────
const NIVEL = {
  SIN_ASISTENCIA: { color: '#7c3aed', bg: '#ede9fe', label: 'Sin asistencia', desc: 'Nunca ha asistido a ninguna sesión' },
  LEVE:           { color: '#f59e0b', bg: '#fef3c7', label: 'Leve',           desc: '2–3 sesiones sin asistir' },
  MODERADO:       { color: '#f97316', bg: '#ffedd5', label: 'Moderado',       desc: '4–5 sesiones sin asistir' },
  ALTO:           { color: '#dc2626', bg: '#fee2e2', label: 'Alto',           desc: '6+ sesiones consecutivas' },
}

function NivelBadge({ nivel }) {
  const n = NIVEL[nivel] || NIVEL.LEVE
  return (
    <span title={n.desc} style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
      background: n.bg, color: n.color,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: n.color, display: 'inline-block' }} />
      {n.label}
    </span>
  )
}

function ResumenNiveles({ data }) {
  const counts = { SIN_ASISTENCIA: 0, LEVE: 0, MODERADO: 0, ALTO: 0 }
  data.forEach(d => { if (counts[d.nivelRiesgo] !== undefined) counts[d.nivelRiesgo]++ })
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 20 }}>
      {Object.entries(NIVEL).map(([key, n]) => (
        <Card key={key} style={{ padding: '16px 18px', borderLeft: `4px solid ${n.color}` }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: n.color }}>{counts[key]}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gt-text)' }}>{n.label}</div>
          <div style={{ fontSize: 11, color: 'var(--gt-muted)', marginTop: 2 }}>{n.desc}</div>
        </Card>
      ))}
    </div>
  )
}

function SolicitudCard({ solicitud, onAtender, atendiendo }) {
  const pendiente = !solicitud.atendida
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '16px 20px',
      border: `1.5px solid ${pendiente ? '#fde68a' : 'var(--gt-border)'}`,
      borderLeft: `4px solid ${pendiente ? '#f59e0b' : '#16a34a'}`,
      display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
      marginBottom: 10,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
        background: pendiente ? '#fef3c7' : '#f0faf0',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
      }}>
        {pendiente ? '🙋' : '✅'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--gt-text)', margin: '0 0 2px' }}>
          {solicitud.nombreCompleto || `Participante #${solicitud.participanteId}`}
        </p>
        <p style={{ fontSize: 12, color: 'var(--gt-muted)', margin: 0 }}>
          {solicitud.fechaSolicitud?.split('T')[0]} ·{' '}
          {pendiente ? <span style={{ color: '#f59e0b', fontWeight: 700 }}>Pendiente</span> : <span style={{ color: '#16a34a', fontWeight: 700 }}>Atendida</span>}
        </p>
      </div>
      {pendiente && (
        <Btn size="sm" onClick={() => onAtender(solicitud.id)} disabled={atendiendo === solicitud.id}>
          {atendiendo === solicitud.id ? 'Atendiendo...' : 'Marcar atendida'}
        </Btn>
      )}
    </div>
  )
}

export default function AlertasPage() {
  const a = useAlertas()
  const [tab, setTab] = useState('inasistencia')
  const [atendiendo, setAtendiendo] = useState(null)

  useEffect(() => {
    a.loadInasistencias()
    a.loadSolicitudes()
  }, [])

  const handleAtender = async (id) => {
    setAtendiendo(id)
    try { await a.atender(id) } catch {}
    setAtendiendo(null)
  }

  const inasistencias = a.inasistencias || []
  const solicitudes   = a.solicitudes   || []
  const pendientes    = solicitudes.filter(s => !s.atendida)

  return (
    <div>
      <PageHeader title="Alertas" subtitle="Inasistencia y solicitudes de ayuda" />

      <TabBar
        tabs={[
          { key: 'inasistencia', label: `Inasistencia (${inasistencias.length})` },
          { key: 'solicitudes',  label: `Solicitudes de ayuda${pendientes.length > 0 ? ` · ${pendientes.length} pendientes` : ''}` },
        ]}
        active={tab}
        onChange={setTab}
      />

      {/* ── Inasistencia ── */}
      {tab === 'inasistencia' && (
        <div>
          <ResumenNiveles data={inasistencias} />

          {/* Leyenda de niveles */}
          <Card style={{ marginBottom: 16, padding: '12px 16px', background: 'var(--gt-bg)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--gt-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              Criterios de clasificación
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {Object.entries(NIVEL).map(([key, n]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: n.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--gt-muted)' }}>
                    <strong style={{ color: n.color }}>{n.label}:</strong> {n.desc}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Table
            columns={[
              { key: 'nombreCompleto', label: 'Participante', render: (v, row) => v || `#${row.participanteId}` },
              { key: 'nivelRiesgo',    label: 'Nivel',        render: v => <NivelBadge nivel={v} /> },
              { key: 'sesionesInasistidas', label: 'Faltas' },
              { key: 'rutaNombre',     label: 'Módulo',       render: (v, row) => v || `Ruta ${row.rutaId}` },
            ]}
            data={inasistencias}
          />
          
        </div>
      )}

      {/* ── Solicitudes de ayuda ── */}
      {tab === 'solicitudes' && (
        <div>
          {solicitudes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gt-muted)' }}>
              <p style={{ fontSize: 32, marginBottom: 8 }}>🙌</p>
              <p style={{ fontWeight: 700 }}>Sin solicitudes registradas</p>
            </div>
          ) : (
            solicitudes.map(sol => (
              <SolicitudCard key={sol.id} solicitud={sol} onAtender={handleAtender} atendiendo={atendiendo} />
            ))
          )}
          
        </div>
      )}
    </div>
  )
}
