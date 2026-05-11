import { useState, useRef, useCallback } from 'react'
import { useReportes, useRutas } from '../../../application/hooks'
import { Btn, Input, Select, Table, PageHeader, Card } from '../../components/ui/index'

// ── Colores por slot ───────────────────────────────────────────────────────
const PALETTE = ['#16a34a','#22c55e','#4ade80','#86efac','#f59e0b','#f97316','#06b6d4','#8b5cf6','#ec4899','#64748b']
const color = (i) => PALETTE[i % PALETTE.length]

// ── Gráfica de barras SVG ──────────────────────────────────────────────────
function BarChart({ data, labelKey = 'etiqueta', valueKey = 'total', title }) {
  if (!data?.length) return null
  const max = Math.max(...data.map(d => Number(d[valueKey]) || 0)) || 1
  const W = 600, H = 260, PAD = { top: 20, right: 20, bottom: 80, left: 50 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom
  const barW = Math.min(40, chartW / data.length - 6)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block' }}>
      {title && <text x={W / 2} y={14} textAnchor="middle" fontSize={12} fill="#6b7280" fontFamily="DM Sans">{title}</text>}
      {/* Eje Y */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const y = PAD.top + chartH - t * chartH
        return (
          <g key={i}>
            <line x1={PAD.left} x2={PAD.left + chartW} y1={y} y2={y} stroke="#e8ece8" strokeWidth={1} />
            <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize={10} fill="#9ca3af" fontFamily="DM Sans">
              {Math.round(max * t)}
            </text>
          </g>
        )
      })}
      {/* Barras */}
      {data.map((d, i) => {
        const val = Number(d[valueKey]) || 0
        const x = PAD.left + (chartW / data.length) * i + (chartW / data.length - barW) / 2
        const barH = (val / max) * chartH
        const y = PAD.top + chartH - barH
        const label = String(d[labelKey] || '')
        const short = label.length > 12 ? label.slice(0, 11) + '…' : label
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} fill={color(i)} rx={4} opacity={0.9} />
            <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize={10} fill="#374151" fontFamily="DM Sans" fontWeight="600">{val}</text>
            <text x={x + barW / 2} y={PAD.top + chartH + 16} textAnchor="middle" fontSize={9} fill="#6b7280" fontFamily="DM Sans"
              transform={`rotate(-35, ${x + barW / 2}, ${PAD.top + chartH + 16})`}>{short}</text>
          </g>
        )
      })}
      {/* Eje X línea */}
      <line x1={PAD.left} x2={PAD.left + chartW} y1={PAD.top + chartH} y2={PAD.top + chartH} stroke="#d1d5db" strokeWidth={1} />
    </svg>
  )
}

// ── Gráfica de línea SVG ───────────────────────────────────────────────────
function LineChart({ data, labelKey, valueKey = 'total', title }) {
  if (!data?.length) return null
  const max = Math.max(...data.map(d => Number(d[valueKey]) || 0)) || 1
  const W = 600, H = 240, PAD = { top: 20, right: 20, bottom: 60, left: 50 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom
  const n = data.length

  const pts = data.map((d, i) => ({
    x: PAD.left + (i / Math.max(n - 1, 1)) * chartW,
    y: PAD.top + chartH - (Number(d[valueKey]) / max) * chartH,
    val: Number(d[valueKey]),
    label: String(d[labelKey] || d.semana || '')
  }))

  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const area = `${path} L${pts[pts.length - 1].x},${PAD.top + chartH} L${pts[0].x},${PAD.top + chartH} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block' }}>
      {title && <text x={W / 2} y={14} textAnchor="middle" fontSize={12} fill="#6b7280" fontFamily="DM Sans">{title}</text>}
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16a34a" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#16a34a" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const y = PAD.top + chartH - t * chartH
        return (
          <g key={i}>
            <line x1={PAD.left} x2={PAD.left + chartW} y1={y} y2={y} stroke="#e8ece8" strokeWidth={1} strokeDasharray={i === 0 ? 'none' : '4,4'} />
            <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize={10} fill="#9ca3af" fontFamily="DM Sans">{Math.round(max * t)}</text>
          </g>
        )
      })}
      <path d={area} fill="url(#areaGrad)" />
      <path d={path} fill="none" stroke="#16a34a" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill="#16a34a" stroke="#fff" strokeWidth={2} />
          <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize={9} fill="#374151" fontFamily="DM Sans" fontWeight="600">{p.val}</text>
          {(n <= 12 || i % Math.ceil(n / 8) === 0) && (
            <text x={p.x} y={PAD.top + chartH + 16} textAnchor="middle" fontSize={9} fill="#6b7280" fontFamily="DM Sans"
              transform={`rotate(-30, ${p.x}, ${PAD.top + chartH + 16})`}>
              {p.label.slice(0, 10)}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}

// ── Gráfica de torta SVG ───────────────────────────────────────────────────
function PieChart({ data, labelKey = 'etiqueta', valueKey = 'total', title }) {
  if (!data?.length) return null
  const total = data.reduce((s, d) => s + (Number(d[valueKey]) || 0), 0)
  if (total === 0) return null
  const R = 80, CX = 100, CY = 100
  let angle = -Math.PI / 2
  const slices = data.map((d, i) => {
    const val = Number(d[valueKey]) || 0
    const sweep = (val / total) * 2 * Math.PI
    const x1 = CX + R * Math.cos(angle)
    const y1 = CY + R * Math.sin(angle)
    angle += sweep
    const x2 = CX + R * Math.cos(angle)
    const y2 = CY + R * Math.sin(angle)
    const mid = angle - sweep / 2
    return { x1, y1, x2, y2, sweep, val, label: d[labelKey], color: color(i), mid, pct: ((val / total) * 100).toFixed(1) }
  })

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
      <svg viewBox="0 0 200 200" style={{ width: 180, flexShrink: 0 }}>
        {title && <text x={100} y={14} textAnchor="middle" fontSize={11} fill="#6b7280" fontFamily="DM Sans">{title}</text>}
        {slices.map((s, i) => (
          <path key={i}
            d={`M${CX},${CY} L${s.x1},${s.y1} A${R},${R} 0 ${s.sweep > Math.PI ? 1 : 0},1 ${s.x2},${s.y2} Z`}
            fill={s.color} stroke="#fff" strokeWidth={2} opacity={0.9} />
        ))}
        <circle cx={CX} cy={CY} r={40} fill="white" />
        <text x={CX} y={CY - 4} textAnchor="middle" fontSize={12} fill="#111" fontFamily="DM Sans" fontWeight="700">{total}</text>
        <text x={CX} y={CY + 12} textAnchor="middle" fontSize={9} fill="#6b7280" fontFamily="DM Sans">total</text>
      </svg>
      <div style={{ flex: 1, minWidth: 160 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: 12, color: '#374151', fontFamily: 'DM Sans' }}>
              <span style={{ fontWeight: 600 }}>{s.pct}%</span> {s.label}
            </div>
            <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>{s.val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Gráfica comparativa PRE/POST ───────────────────────────────────────────
function CompareChart({ data }) {
  if (!data?.length) return null
  const max = Math.max(...data.flatMap(d => [d.promedioPre || 0, d.promedioPost || 0])) || 5
  const W = 660, H = 280, PAD = { top: 30, right: 20, bottom: 90, left: 50 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom
  const groupW = chartW / data.length
  const barW = Math.min(20, groupW / 3)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block' }}>
      {/* Leyenda */}
      <rect x={PAD.left} y={4} width={12} height={12} fill="#f59e0b" rx={2} />
      <text x={PAD.left + 16} y={14} fontSize={11} fill="#374151" fontFamily="DM Sans">PRE</text>
      <rect x={PAD.left + 50} y={4} width={12} height={12} fill="#16a34a" rx={2} />
      <text x={PAD.left + 66} y={14} fontSize={11} fill="#374151" fontFamily="DM Sans">POST</text>

      {[0, 1, 2, 3, 4, 5].map((v, i) => {
        const y = PAD.top + chartH - (v / max) * chartH
        return (
          <g key={i}>
            <line x1={PAD.left} x2={PAD.left + chartW} y1={y} y2={y} stroke="#e8ece8" strokeWidth={1} />
            <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize={10} fill="#9ca3af" fontFamily="DM Sans">{v}</text>
          </g>
        )
      })}

      {data.map((d, i) => {
        const cx = PAD.left + groupW * i + groupW / 2
        const hPre = ((d.promedioPre || 0) / max) * chartH
        const hPost = ((d.promedioPost || 0) / max) * chartH
        const label = (d.pregunta || '').slice(0, 16)

        return (
          <g key={i}>
            <rect x={cx - barW - 2} y={PAD.top + chartH - hPre} width={barW} height={hPre} fill="#f59e0b" rx={3} opacity={0.85} />
            <rect x={cx + 2} y={PAD.top + chartH - hPost} width={barW} height={hPost} fill="#16a34a" rx={3} opacity={0.85} />
            <text x={cx} y={PAD.top + chartH + 16} textAnchor="middle" fontSize={8.5} fill="#6b7280" fontFamily="DM Sans"
              transform={`rotate(-40, ${cx}, ${PAD.top + chartH + 16})`}>{label}</text>
            {/* Flecha de mejora */}
            {d.promedioPost > d.promedioPre && (
              <text x={cx + barW / 2 + 6} y={PAD.top + chartH - hPost - 4} fontSize={9} fill="#16a34a" fontFamily="DM Sans">↑</text>
            )}
          </g>
        )
      })}
      <line x1={PAD.left} x2={PAD.left + chartW} y1={PAD.top + chartH} y2={PAD.top + chartH} stroke="#d1d5db" />
    </svg>
  )
}

// ── Gráfica de retención ───────────────────────────────────────────────────
function RetencionChart({ data }) {
  if (!data?.length) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      {data.map((d, i) => {
        const pct = Math.min(d.tasaRetencion || 0, 100)
        const color = pct >= 70 ? '#16a34a' : pct >= 40 ? '#f59e0b' : '#dc2626'
        const r = 36, circ = 2 * Math.PI * r
        const stroke = circ * (pct / 100)
        return (
          <div key={i} style={{ textAlign: 'center', minWidth: 120 }}>
            <svg viewBox="0 0 88 88" width={88} height={88}>
              <circle cx={44} cy={44} r={r} fill="none" stroke="#e8ece8" strokeWidth={8} />
              <circle cx={44} cy={44} r={r} fill="none" stroke={color} strokeWidth={8}
                strokeDasharray={`${stroke} ${circ}`} strokeLinecap="round"
                transform="rotate(-90 44 44)" />
              <text x={44} y={44} textAnchor="middle" dominantBaseline="middle"
                fontSize={14} fontWeight="700" fill={color} fontFamily="DM Sans">{pct.toFixed(0)}%</text>
            </svg>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#111', marginTop: 4 }}>{d.ruta}</div>
            <div style={{ fontSize: 11, color: '#6b7280' }}>{d.activos}/{d.totalInscritos} activos</div>
          </div>
        )
      })}
    </div>
  )
}

// ── Exportar SVG/PNG ───────────────────────────────────────────────────────
function useExport(containerRef, title) {
  const exportPNG = useCallback(() => {
    const svg = containerRef.current?.querySelector('svg')
    if (!svg) return
    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svg)
    const canvas = document.createElement('canvas')
    const scale = 2
    const vb = svg.viewBox.baseVal
    canvas.width = (vb.width || 600) * scale
    canvas.height = (vb.height || 280) * scale
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const img = new Image()
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      const a = document.createElement('a')
      a.download = `${title.replace(/\s+/g, '_')}.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
    }
    img.src = url
  }, [containerRef, title])

  const exportSVG = useCallback(() => {
    const svg = containerRef.current?.querySelector('svg')
    if (!svg) return
    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svg)
    const blob = new Blob([svgStr], { type: 'image/svg+xml' })
    const a = document.createElement('a')
    a.download = `${title.replace(/\s+/g, '_')}.svg`
    a.href = URL.createObjectURL(blob)
    a.click()
  }, [containerRef, title])

  const exportCSV = useCallback((data, columns) => {
    if (!data?.length) return
    const headers = columns.map(c => c.label).join(',')
    const rows = data.map(row => columns.map(c => `"${row[c.key] ?? ''}"`).join(',')).join('\n')
    const blob = new Blob([headers + '\n' + rows], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.download = `${title.replace(/\s+/g, '_')}.csv`
    a.href = URL.createObjectURL(blob)
    a.click()
  }, [title])

  return { exportPNG, exportSVG, exportCSV }
}

// ── Configuración de tabs ──────────────────────────────────────────────────
const TABS = [
  { key: 'asistencia_ruta',      label: 'Asist. por ruta',       group: 'Asistencia' },
  { key: 'asistencia_programa',  label: 'Asist. por programa',    group: 'Asistencia' },
  { key: 'asistencia_semestre',  label: 'Asist. por semestre',    group: 'Asistencia' },
  { key: 'tendencia',            label: 'Tendencia temporal',      group: 'Asistencia' },
  { key: 'part_programa',        label: 'Part. por programa',     group: 'Participantes' },
  { key: 'part_semestre',        label: 'Part. por semestre',     group: 'Participantes' },
  { key: 'part_ruta',            label: 'Part. por ruta',         group: 'Participantes' },
  { key: 'fichas',               label: 'PRE vs POST',            group: 'Bienestar' },
  { key: 'retencion',            label: 'Retención',              group: 'Bienestar' },
]

const CHART_TYPES = {
  asistencia_ruta:     ['bar', 'pie'],
  asistencia_programa: ['bar', 'pie'],
  asistencia_semestre: ['bar', 'pie'],
  tendencia:           ['line'],
  part_programa:       ['bar', 'pie'],
  part_semestre:       ['bar', 'pie'],
  part_ruta:           ['pie', 'bar'],
  fichas:              ['compare'],
  retencion:           ['gauge'],
}

// ── Página principal ────────────────────────────────────────────────────────
export default function ReportesPage() {
  const rep = useReportes()
  const r = useRutas()
  const chartRef = useRef(null)

  const [tab, setTab] = useState('asistencia_ruta')
  const [chartType, setChartType] = useState('bar')
  const [rutaId, setRutaId] = useState('')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [programa, setPrograma] = useState('')
  const [semestre, setSemestre] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [consulted, setConsulted] = useState(false)

  const tabLabel = TABS.find(t => t.key === tab)?.label || tab
  const { exportPNG, exportSVG, exportCSV } = useExport(chartRef, tabLabel)

  const rutaOpts = r.data.map(x => ({ value: x.id, label: x.nombre }))

  const changeTab = (key) => {
    setTab(key)
    setData([])
    setConsulted(false)
    const types = CHART_TYPES[key] || ['bar']
    setChartType(types[0])
  }

  const consultar = async () => {
    setLoading(true); setData([]); setConsulted(false)
    try {
      let res
      const rId = rutaId || null, d = desde || null, h = hasta || null
      const prog = programa || null, sem = semestre ? parseInt(semestre) : null

      if (tab === 'asistencia_ruta')     res = await rep.asistenciaPorRuta(rId, d, h, prog, sem)
      if (tab === 'asistencia_programa') res = await rep.asistenciaPorPrograma(rId, d, h, sem)
      if (tab === 'asistencia_semestre') res = await rep.asistenciaPorSemestre(rId, d, h, prog)
      if (tab === 'tendencia')           res = await rep.tendenciaSemanal(rId, d, h)
      if (tab === 'part_programa')       res = await rep.participantesPorPrograma(rId, sem)
      if (tab === 'part_semestre')       res = await rep.participantesPorSemestre(rId, prog)
      if (tab === 'part_ruta')           res = await rep.participantesPorRuta()
      if (tab === 'fichas')              res = await rep.comparativaFichas(rId, prog)
      if (tab === 'retencion')           res = await rep.retencion()

      setData(res || [])
      setConsulted(true)
    } catch {}
    setLoading(false)
  }

  const getTableColumns = () => {
    if (['asistencia_ruta','asistencia_programa','asistencia_semestre'].includes(tab))
      return [{ key: 'etiqueta', label: 'Grupo' }, { key: 'total', label: 'Total asistencias' }]
    if (tab === 'tendencia')
      return [{ key: 'semana', label: 'Fecha' }, { key: 'total', label: 'Asistencias' }]
    if (['part_programa','part_semestre','part_ruta'].includes(tab))
      return [{ key: 'etiqueta', label: 'Grupo' }, { key: 'total', label: 'Participantes' }]
    if (tab === 'fichas')
      return [
        { key: 'pregunta', label: 'Pregunta' },
        { key: 'promedioPre', label: 'PRE', render: v => v?.toFixed(2) },
        { key: 'promedioPost', label: 'POST', render: v => v?.toFixed(2) },
        { key: 'dif', label: 'Δ', render: (_, row) => {
          const d = ((row.promedioPost || 0) - (row.promedioPre || 0)).toFixed(2)
          return <span style={{ color: d >= 0 ? '#16a34a' : '#dc2626', fontWeight: 700 }}>{d >= 0 ? '+' : ''}{d}</span>
        }}
      ]
    if (tab === 'retencion')
      return [
        { key: 'ruta', label: 'Ruta' },
        { key: 'totalInscritos', label: 'Total inscritos' },
        { key: 'activos', label: 'Activos' },
        { key: 'inactivos', label: 'Inactivos' },
        { key: 'tasaRetencion', label: 'Retención %', render: v => `${(v || 0).toFixed(1)}%` }
      ]
    return []
  }

  const showFechas = ['asistencia_ruta','asistencia_programa','asistencia_semestre','tendencia'].includes(tab)
  const showRuta   = !['part_ruta','retencion'].includes(tab)
  const showProg   = ['asistencia_ruta','asistencia_semestre','part_semestre','fichas'].includes(tab)
  const showSem    = ['asistencia_ruta','asistencia_programa','part_programa'].includes(tab)
  const noFiltros  = ['part_ruta','retencion'].includes(tab)
  const types      = CHART_TYPES[tab] || ['bar']

  // Resumen rápido
  const total = data.reduce ? data.reduce((s, d) => s + (Number(d.total) || 0), 0) : 0

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <PageHeader title="Reportes" subtitle="Análisis visual del Gimnasio Transmoderno" />

      {/* Tab selector agrupado */}
      <div style={{ marginBottom: 20 }}>
        {['Asistencia','Participantes','Bienestar'].map(group => (
          <div key={group} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{group}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {TABS.filter(t => t.group === group).map(t => (
                <button key={t.key} onClick={() => changeTab(t.key)} style={{
                  padding: '7px 14px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', transition: 'all .18s',
                  background: tab === t.key ? '#16a34a' : '#f0faf0',
                  color: tab === t.key ? '#fff' : '#374151',
                  boxShadow: tab === t.key ? '0 2px 8px rgba(22,163,74,.25)' : 'none'
                }}>{t.label}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      {!noFiltros && (
        <Card style={{ marginBottom: 20, background: '#f9fef9', border: '1px solid #e8ece8' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 12 }}>Filtros</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 10 }}>
            {showRuta && (
              <Select label="Ruta" value={rutaId} onChange={e => setRutaId(e.target.value)} options={rutaOpts} />
            )}
            {showFechas && <>
              <Input label="Desde" type="date" value={desde} onChange={e => setDesde(e.target.value)} style={{ marginBottom: 0 }} />
              <Input label="Hasta" type="date" value={hasta} onChange={e => setHasta(e.target.value)} style={{ marginBottom: 0 }} />
            </>}
            {showProg && (
              <Input label="Programa" value={programa} onChange={e => setPrograma(e.target.value)}
                placeholder="Ej: Ingeniería de Sistemas" style={{ marginBottom: 0 }} />
            )}
            {showSem && (
              <Input label="Semestre" type="number" min="1" max="12" value={semestre}
                onChange={e => setSemestre(e.target.value)} style={{ marginBottom: 0 }} />
            )}
          </div>
          <div style={{ marginTop: 14 }}>
            <Btn onClick={consultar} disabled={loading}>{loading ? 'Consultando...' : 'Consultar'}</Btn>
          </div>
        </Card>
      )}

      {noFiltros && (
        <div style={{ marginBottom: 16 }}>
          <Btn onClick={consultar} disabled={loading}>{loading ? 'Consultando...' : 'Consultar'}</Btn>
        </div>
      )}

      {/* Resultados */}
      {consulted && data.length > 0 && (
        <>
          {/* Barra de herramientas */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{data.length} grupos</span>
              {['asistencia_ruta','asistencia_programa','asistencia_semestre','part_programa','part_semestre','part_ruta'].includes(tab) && (
                <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 700, marginLeft: 8 }}>Total: {total}</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {/* Selector de tipo de gráfica */}
              {types.length > 1 && types.map(ct => (
                <button key={ct} onClick={() => setChartType(ct)} style={{
                  padding: '5px 12px', borderRadius: 6, border: `1.5px solid ${chartType === ct ? '#16a34a' : '#d1d5db'}`,
                  background: chartType === ct ? '#f0faf0' : '#fff', fontSize: 12, fontWeight: 600,
                  color: chartType === ct ? '#16a34a' : '#6b7280', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
                }}>
                  {{ bar: '▐ Barras', pie: '◉ Torta', line: '∿ Línea', compare: '⊟ Comparar', gauge: '◎ Gauge' }[ct]}
                </button>
              ))}
              {/* Exportar */}
              <button onClick={exportPNG} style={{ padding: '5px 12px', borderRadius: 6, border: '1.5px solid #d1d5db', background: '#fff', fontSize: 12, color: '#374151', cursor: 'pointer', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>↓ PNG</button>
              <button onClick={exportSVG} style={{ padding: '5px 12px', borderRadius: 6, border: '1.5px solid #d1d5db', background: '#fff', fontSize: 12, color: '#374151', cursor: 'pointer', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>↓ SVG</button>
              <button onClick={() => exportCSV(data, getTableColumns())} style={{ padding: '5px 12px', borderRadius: 6, border: '1.5px solid #d1d5db', background: '#fff', fontSize: 12, color: '#374151', cursor: 'pointer', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>↓ CSV</button>
            </div>
          </div>

          {/* Gráfica */}
          <Card style={{ marginBottom: 20, padding: '24px 20px' }} ref={chartRef}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 16 }}>{tabLabel}</div>
            <div ref={chartRef}>
              {(chartType === 'bar') && <BarChart data={data} title={tabLabel} />}
              {(chartType === 'pie') && <PieChart data={data} title={tabLabel} />}
              {(chartType === 'line' || tab === 'tendencia') && (
                <LineChart data={data} labelKey="semana" title={tabLabel} />
              )}
              {(tab === 'fichas') && <CompareChart data={data} />}
              {(tab === 'retencion') && <RetencionChart data={data} />}
            </div>
          </Card>

          {/* Tabla */}
          <Table columns={getTableColumns()} data={data} />
        </>
      )}

      {consulted && data.length === 0 && (
        <Card style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#374151' }}>Sin datos para los filtros seleccionados</div>
          <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 6 }}>Prueba con otros filtros o verifica que haya sesiones registradas</div>
        </Card>
      )}

      {!consulted && !loading && (
        <Card style={{ textAlign: 'center', padding: 60, background: '#f9fef9', border: '1px dashed #c8d8c8' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📈</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#374151' }}>Selecciona los filtros y presiona Consultar</div>
          <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 6 }}>Los reportes se generan en tiempo real desde la base de datos</div>
        </Card>
      )}
    </div>
  )
}
