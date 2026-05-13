// ── Parser ───────────────────────────────────────────────────────────────────
export function parsePregunta(texto = '') {
  const match = texto.match(/^\[([A-Z0-9]+)\|([^|]*)\|?([^\]]*)\](.+)$/)
  if (!match) return { tipo: 'SCALE5', label: texto, params: [], group: null }
  const [, tipo, paramStr, group, label] = match
  return { tipo, label: label.trim(), params: paramStr ? paramStr.split(',').map(s => s.trim()) : [], group: group || null }
}

export function getAnswerLabel(texto = '', valor) {
  if (valor === undefined || valor === null) return '—'
  const { tipo, params } = parsePregunta(texto)
  const idx = Number(valor) - 1
  if (['SELECT','MULTI','SCALE3','MATRIX'].includes(tipo)) return params[idx] ?? String(valor)
  if (['SCALE5','SCALE4'].includes(tipo)) return `${valor} / 5 — (${params[0] ?? ''}–${params[1] ?? ''})`
  if (tipo === 'NUMBER') return `${valor} ${params[0] && params[0] !== 'id' ? params[0] : ''}`
  return String(valor)
}

function buildGroups(preguntas) {
  const result = []
  let i = 0
  while (i < preguntas.length) {
    const p = preguntas[i]
    const { group } = parsePregunta(p.texto)
    if (group) {
      const block = [p]
      while (i + 1 < preguntas.length && parsePregunta(preguntas[i + 1].texto).group === group) {
        i++; block.push(preguntas[i])
      }
      result.push({ type: 'matrix', group, preguntas: block })
    } else {
      result.push({ type: 'single', pregunta: p })
    }
    i++
  }
  return result
}

const GROUP_LABELS = {
  condicion_fisica:      { titulo: '7. Percepción de tu condición física',                          sub: 'Escala: 1 = Muy baja · 5 = Muy buena' },
  sintomas_estres:       { titulo: '8. Síntomas físicos asociados al estrés',                       sub: 'Escala: 1 = Nunca · 5 = Siempre' },
  exp_emocional:         { titulo: '9. Experiencias emocionales (últimas 2 semanas)',                sub: 'Escala: 1 = Nunca · 5 = Siempre' },
  actividades:           { titulo: '16. Actividades de interés que practicas actualmente',           sub: 'Selecciona una opción por actividad' },
  condicion_fisica_post: { titulo: '7. Cambios percibidos en tu condición física',                  sub: 'Selecciona la opción que mejor describe el cambio' },
  sintomas_fisicos_post: { titulo: '8. Cambios físicos percibidos en síntomas',                     sub: 'Selecciona la opción que mejor describe el cambio' },
  estres_post:           { titulo: '9. Síntomas físicos asociados al estrés tras participar',        sub: 'Selecciona la opción que mejor describe el cambio' },
  estrategias_post:      { titulo: '13. Frecuencia con que usas estas estrategias para el estrés', sub: 'Nunca → Siempre' },
}

// ── Input: chips de selección ─────────────────────────────────────────────────
function ChipSelect({ params, value, onChange }) {
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:10 }}>
      {params.map((opt, i) => {
        const val = i + 1
        const sel = value === val
        return (
          <button key={i} type="button" onClick={() => onChange(sel ? null : val)} style={{
            padding:'8px 16px', borderRadius:20, border:'1.5px solid',
            borderColor: sel ? '#0D5C2F' : '#D4E2D8',
            background: sel ? '#0D5C2F' : '#fff',
            color: sel ? '#fff' : '#374151',
            fontSize:13, fontWeight: sel ? 700 : 500,
            cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'all .15s',
          }}>{opt}</button>
        )
      })}
    </div>
  )
}

// ── Input: escala numérica ────────────────────────────────────────────────────
function ScaleInput({ params, value, onChange }) {
  const [min, max] = params
  return (
    <div style={{ marginTop:10 }}>
      <div style={{ display:'flex', gap:8 }}>
        {[1,2,3,4,5].map(v => {
          const sel = value === v
          return (
            <button key={v} type="button" onClick={() => onChange(sel ? null : v)} style={{
              width:42, height:42, borderRadius:10,
              border: sel ? '2px solid #0D5C2F' : '1.5px solid #D4E2D8',
              background: sel ? '#0D5C2F' : '#fff',
              color: sel ? '#fff' : '#374151',
              fontWeight:700, fontSize:15, cursor:'pointer',
              fontFamily:"'DM Sans',sans-serif", transition:'all .15s',
            }}>{v}</button>
          )
        })}
      </div>
      {(min || max) && (
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:4, width:42*5+8*4 }}>
          <span style={{ fontSize:11, color:'#9CA3AF' }}>{min}</span>
          <span style={{ fontSize:11, color:'#9CA3AF' }}>{max}</span>
        </div>
      )}
    </div>
  )
}

// ── Input: campo numérico ─────────────────────────────────────────────────────
function NumberInput({ params, value, onChange }) {
  const unit = params[0]
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:10 }}>
      <input type="number" value={value || ''} onChange={e => onChange(parseInt(e.target.value) || '')}
        style={{ padding:'9px 14px', border:'1.5px solid #D4E2D8', borderRadius:9, fontSize:16, fontWeight:700, width:130, outline:'none', fontFamily:"'DM Sans',sans-serif", textAlign:'center' }}
        onFocus={e => { e.target.style.borderColor = '#0D5C2F' }}
        onBlur={e => { e.target.style.borderColor = '#D4E2D8' }}
      />
      {unit && unit !== 'id' && <span style={{ fontSize:14, fontWeight:700, color:'#9CA3AF' }}>{unit}</span>}
    </div>
  )
}

// ── Fila de matriz ────────────────────────────────────────────────────────────
function MatrixRow({ label, pregId, value, onChange, options, labeled }) {
  return (
    <div style={{ display:'flex', alignItems:'center', padding:'11px 14px', borderBottom:'1px solid #F0F4F0', flexWrap:'wrap', gap:8 }}>
      <div style={{ width:180, flexShrink:0, fontSize:13, color:'#374151', fontWeight:500, paddingRight:10, minWidth:120 }}>{label}</div>
      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
        {options.map((opt, i) => {
          const val = i + 1
          const sel = value === val
          return (
            <button key={i} type="button" onClick={() => onChange(pregId, sel ? null : val)} style={{
              padding: labeled ? '6px 12px' : '0',
              width: labeled ? 'auto' : 38, height:38,
              borderRadius:8, border: sel ? '2px solid #0D5C2F' : '1.5px solid #D4E2D8',
              background: sel ? '#0D5C2F' : '#fff', color: sel ? '#fff' : '#374151',
              fontWeight:700, fontSize: labeled ? 12 : 14, cursor:'pointer',
              fontFamily:"'DM Sans',sans-serif", transition:'all .12s', whiteSpace:'nowrap',
            }}>
              {labeled ? opt : val}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function FichaForm({ preguntas, respuestas, setRespuesta }) {
  if (!preguntas?.length) return (
    <div style={{ textAlign:'center', padding:'32px 0', color:'#9CA3AF', fontSize:13 }}>
      No hay preguntas disponibles
    </div>
  )

  const activas = preguntas.filter(p => p.activa !== false)
  const groups  = buildGroups(activas)
  const getVal  = (pregId) => respuestas.find(r => r.preguntaId === pregId)?.valor
  const set     = (pregId, val) => setRespuesta(pregId, val)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      {groups.map((g, gi) => {

        // ── Pregunta individual ──────────────────────────────────────────────
        if (g.type === 'single') {
          const p = g.pregunta
          const { tipo, label, params } = parsePregunta(p.texto)
          const val = getVal(p.id)
          return (
            <div key={p.id} style={{ background:'#fff', borderRadius:14, padding:'16px 18px', border:'1px solid #E5EDE5' }}>
              <p style={{ fontWeight:700, fontSize:14, color:'#111', margin:'0 0 2px', lineHeight:1.4 }}>
                {gi + 1}. {label}
              </p>
              {['SELECT','MULTI'].includes(tipo) && <ChipSelect params={params} value={val} onChange={v => set(p.id, v)} />}
              {['SCALE5','SCALE4'].includes(tipo)  && <ScaleInput params={params} value={val} onChange={v => set(p.id, v)} />}
              {tipo === 'NUMBER'                   && <NumberInput params={params} value={val} onChange={v => set(p.id, v)} />}
              {tipo === 'SCALE3'                   && <ChipSelect params={params} value={val} onChange={v => set(p.id, v)} />}
              {!['SELECT','MULTI','SCALE5','SCALE4','NUMBER','SCALE3','MATRIX'].includes(tipo) &&
                <ScaleInput params={['1','5']} value={val} onChange={v => set(p.id, v)} />}
            </div>
          )
        }

        // ── Bloque matriz ────────────────────────────────────────────────────
        const meta = GROUP_LABELS[g.group] || { titulo: g.group, sub:'' }
        const { tipo: mTipo, params: mParams } = parsePregunta(g.preguntas[0].texto)
        const isLabeled = ['SCALE3','MATRIX'].includes(mTipo)
        const scaleOptions = isLabeled ? mParams : [1,2,3,4,5]

        return (
          <div key={g.group} style={{ background:'#fff', borderRadius:14, border:'1px solid #E5EDE5', overflow:'hidden' }}>
            {/* Header */}
            <div style={{ padding:'14px 18px', background:'#F9FBF9', borderBottom:'1px solid #F0F4F0' }}>
              <p style={{ fontWeight:800, fontSize:14, color:'#111', margin:'0 0 2px' }}>{meta.titulo}</p>
              <p style={{ fontSize:11, color:'#9CA3AF', margin:0 }}>{meta.sub}</p>
            </div>
            {/* Cabecera de escala */}
            <div style={{ display:'flex', alignItems:'center', padding:'8px 14px', background:'#FAFAFA', borderBottom:'1px solid #F0F4F0', flexWrap:'wrap', gap:6 }}>
              <div style={{ width:180, flexShrink:0, minWidth:120 }} />
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {scaleOptions.map((opt, i) => (
                  <div key={i} style={{
                    width: isLabeled ? 'auto' : 38, padding: isLabeled ? '0 12px' : '0',
                    textAlign:'center', fontSize:11, fontWeight:700, color:'#9CA3AF', whiteSpace:'nowrap',
                  }}>
                    {isLabeled ? opt : opt}
                  </div>
                ))}
              </div>
            </div>
            {/* Filas */}
            {g.preguntas.map(p => {
              const { label } = parsePregunta(p.texto)
              return (
                <MatrixRow
                  key={p.id}
                  label={label}
                  pregId={p.id}
                  value={getVal(p.id)}
                  onChange={set}
                  options={scaleOptions}
                  labeled={isLabeled}
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
