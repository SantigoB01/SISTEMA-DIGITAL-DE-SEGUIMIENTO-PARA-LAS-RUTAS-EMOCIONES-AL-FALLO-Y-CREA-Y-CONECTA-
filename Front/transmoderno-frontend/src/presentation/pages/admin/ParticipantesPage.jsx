import { useState, useRef } from 'react'
import { useParticipantes } from '../../../application/hooks'
import { Participante } from '../../../domain/models'
import { Btn, Input, Table, Pagination, PageHeader, Modal, Badge } from '../../components/ui/index'
import http from '../../../infrastructure/api/httpClient'
import { useToast } from '../../../application/context/ToastContext'

// ── Columnas de mapeo Excel/CSV esperadas ────────────────────────────────
const CSV_TEMPLATE = `numeroIdentificacion,nombreCompleto,correoInstitucional,programaAcademico,semestre,sede,tipoDocumento,estamento
1070464317,Santiago Buitrago,sstivenbuitrago@ucundinamarca.edu.co,Ingeniería de Sistemas,9,FUSAGASUGÁ,CC,ESTUDIANTE`

// ── Modal de importación ─────────────────────────────────────────────────
function ImportModal({ open, onClose, onDone }) {
  const toast = useToast()
  const fileRef = useRef(null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [paso, setPaso] = useState(1) // 1=selección, 2=resultado

  const reset = () => { setFile(null); setResultado(null); setPaso(1) }
  const handleClose = () => { reset(); onClose() }

  const descargarPlantilla = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'plantilla_participantes.csv'
    a.click()
  }

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    const ext = f.name.split('.').pop().toLowerCase()
    if (!['csv', 'xlsx', 'xls'].includes(ext)) {
      toast('Solo se aceptan archivos CSV o Excel', 'error')
      return
    }
    setFile(f)
  }

  const importar = async () => {
    if (!file) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('archivo', file)

      // Si es Excel, convertir a CSV primero en el navegador
      let fileToSend = file
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        toast('Convirtiendo Excel a CSV...', 'success')
        fileToSend = await excelToCsvBlob(file)
      }

      formData.set('archivo', fileToSend, 'import.csv')

      const token = http.getToken()
      const res = await fetch('/api/participantes/importar', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      })

      if (!res.ok) throw await res.json().catch(() => ({ mensaje: res.statusText }))
      const data = await res.json()
      setResultado(data)
      setPaso(2)
      if (data.insertados > 0 || data.actualizados > 0) onDone()
    } catch (e) {
      toast(e.mensaje || 'Error al importar', 'error')
    }
    setLoading(false)
  }

  return (
    <Modal open={open} onClose={handleClose} title="Importar participantes" width={540}>
      {paso === 1 && (
        <div>
          {/* Instrucciones */}
          <div style={{ background: '#f0faf0', borderRadius: 10, padding: 16, marginBottom: 20, fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
            <div style={{ fontWeight: 700, marginBottom: 8, color: '#16a34a' }}>📋 Formato esperado</div>
            El archivo debe tener estas columnas (en cualquier orden):
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['numeroIdentificacion', 'nombreCompleto', 'correoInstitucional', 'programaAcademico', 'semestre'].map(c => (
                <span key={c} style={{ background: '#fff', border: '1px solid #bbdfbb', borderRadius: 4, padding: '2px 8px', fontSize: 12, fontFamily: 'monospace', color: '#16a34a' }}>{c}</span>
              ))}
            </div>
            <div style={{ marginTop: 8, color: '#6b7280' }}>
              Opcionales: <span style={{ fontFamily: 'monospace' }}>sede, tipoDocumento, estamento</span>
            </div>
            <div style={{ marginTop: 8, color: '#6b7280' }}>
              ✅ Los registros existentes (misma cédula) se <strong>actualizan</strong> — no se duplican.
            </div>
          </div>

          {/* Botón plantilla */}
          <div style={{ marginBottom: 16 }}>
            <button onClick={descargarPlantilla} style={{
              padding: '7px 14px', borderRadius: 8, border: '1.5px solid #16a34a',
              background: '#fff', color: '#16a34a', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
            }}>⬇ Descargar plantilla CSV</button>
          </div>

          {/* Selector de archivo */}
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setFile(f) }}
            style={{
              border: `2px dashed ${file ? '#16a34a' : '#d1d5db'}`,
              borderRadius: 12, padding: '32px 20px', textAlign: 'center',
              cursor: 'pointer', marginBottom: 20, transition: 'all .2s',
              background: file ? '#f0faf0' : '#fafafa'
            }}>
            <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFile} style={{ display: 'none' }} />
            <div style={{ fontSize: 28, marginBottom: 8 }}>{file ? '✅' : '📁'}</div>
            {file ? (
              <div>
                <div style={{ fontWeight: 700, color: '#16a34a', fontSize: 15 }}>{file.name}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                  {(file.size / 1024).toFixed(1)} KB · Click para cambiar
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontWeight: 600, color: '#374151', fontSize: 14 }}>Arrastra tu archivo aquí o haz click</div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>CSV, Excel (.xlsx, .xls)</div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Btn variant="ghost" onClick={handleClose}>Cancelar</Btn>
            <Btn onClick={importar} disabled={!file || loading}>
              {loading ? 'Importando...' : `Importar${file ? ` "${file.name}"` : ''}`}
            </Btn>
          </div>
        </div>
      )}

      {paso === 2 && resultado && (
        <div>
          {/* Resultado */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Total procesados', value: resultado.totalRecibidos, color: '#374151' },
              { label: 'Nuevos insertados', value: resultado.insertados, color: '#16a34a' },
              { label: 'Actualizados', value: resultado.actualizados, color: '#0891b2' },
              { label: 'Omitidos / Error', value: resultado.omitidos, color: resultado.omitidos > 0 ? '#dc2626' : '#9ca3af' },
            ].map(s => (
              <div key={s.label} style={{ background: '#f9fef9', borderRadius: 10, padding: '14px 16px', border: '1px solid #e8ece8' }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {resultado.errores?.length > 0 && (
            <div style={{ background: '#fef2f2', borderRadius: 10, padding: 14, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: '#dc2626', marginBottom: 8, fontSize: 13 }}>
                ⚠ {resultado.errores.length} registros con error:
              </div>
              <div style={{ maxHeight: 120, overflowY: 'auto' }}>
                {resultado.errores.map((e, i) => (
                  <div key={i} style={{ fontSize: 12, color: '#7f1d1d', fontFamily: 'monospace', marginBottom: 2 }}>{e}</div>
                ))}
              </div>
            </div>
          )}

          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 36 }}>{resultado.insertados + resultado.actualizados > 0 ? '🎉' : '⚠'}</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#111', marginTop: 8 }}>
              {resultado.insertados + resultado.actualizados > 0
                ? `${resultado.insertados + resultado.actualizados} participantes procesados exitosamente`
                : 'Sin cambios en la base de datos'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Btn variant="secondary" onClick={reset}>Importar otro archivo</Btn>
            <Btn onClick={handleClose}>Cerrar</Btn>
          </div>
        </div>
      )}
    </Modal>
  )
}

// ── Convertir Excel a CSV en el navegador con SheetJS ───────────────────
async function excelToCsvBlob(file) {
  const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs')
  const data = await file.arrayBuffer()
  const wb = XLSX.read(data, { type: 'array' })
  // Tomar la primera hoja
  const ws = wb.Sheets[wb.SheetNames[0]]
  const csv = XLSX.utils.sheet_to_csv(ws)
  return new Blob([csv], { type: 'text/csv' })
}

// ── Página principal de Participantes ────────────────────────────────────
export default function ParticipantesPage() {
  const p = useParticipantes()
  const [modal, setModal] = useState(false)
  const [importModal, setImportModal] = useState(false)
  const [form, setForm] = useState(Participante.empty())
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)

  const openNew = () => { setForm(Participante.empty()); setModal(true) }
  const openEdit = (row) => { setForm({ ...row }); setModal(true) }

  const save = async () => {
    setSaving(true)
    try {
      form.id ? await p.actualizar(form.id, form) : await p.registrar(form)
      setModal(false)
    } catch {}
    setSaving(false)
  }

  const doSearch = () => { search.trim() ? p.buscar(search) : p.load() }

  return (
    <div>
      <PageHeader
        title="Participantes"
        subtitle={`${p.totalItems ? p.totalItems + ' registrados' : 'Gestión de participantes'}`}
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="secondary" icon="plus" onClick={() => setImportModal(true)}>Importar Excel/CSV</Btn>
            <Btn icon="plus" onClick={openNew}>Nuevo</Btn>
          </div>
        }
      />

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <Input
          placeholder="Buscar por número de identificación..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && doSearch()}
          style={{ marginBottom: 0, flex: 1 }}
        />
        <Btn variant="secondary" icon="search" onClick={doSearch}>Buscar</Btn>
        {search && <Btn variant="ghost" onClick={() => { setSearch(''); p.load() }}>Limpiar</Btn>}
      </div>

      <Table
        columns={[
          { key: 'numeroIdentificacion', label: 'Identificación' },
          { key: 'nombreCompleto', label: 'Nombre' },
          { key: 'correoInstitucional', label: 'Correo' },
          { key: 'programaAcademico', label: 'Programa' },
          { key: 'semestre', label: 'Sem.' },
          { key: 'activo', label: 'Estado', render: v => <Badge text={v ? 'Activo' : 'Inactivo'} color={v ? '#16a34a' : '#dc2626'} /> }
        ]}
        data={p.data}
        actions={row => (
          <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
            <Btn variant="ghost" size="sm" icon="edit" onClick={() => openEdit(row)} />
            {row.activo && <Btn variant="ghost" size="sm" icon="trash" onClick={() => confirm('¿Desactivar?') && p.desactivar(row.id)} />}
          </div>
        )}
      />

      <Pagination page={p.page} totalPages={p.totalPages} onChange={pg => p.load(pg)} />

      {/* Modal nuevo/editar */}
      <Modal open={modal} onClose={() => setModal(false)} title={form.id ? 'Editar' : 'Nuevo participante'}>
        <Input label="Identificación" value={form.numeroIdentificacion} onChange={e => setForm({ ...form, numeroIdentificacion: e.target.value })} />
        <Input label="Nombre completo" value={form.nombreCompleto} onChange={e => setForm({ ...form, nombreCompleto: e.target.value })} />
        <Input label="Correo institucional" type="email" value={form.correoInstitucional} onChange={e => setForm({ ...form, correoInstitucional: e.target.value })} />
        <Input label="Programa académico" value={form.programaAcademico} onChange={e => setForm({ ...form, programaAcademico: e.target.value })} />
        <Input label="Semestre" type="number" min="1" max="10" value={form.semestre} onChange={e => setForm({ ...form, semestre: parseInt(e.target.value) || '' })} />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>Cancelar</Btn>
          <Btn onClick={save} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</Btn>
        </div>
      </Modal>

      {/* Modal importar */}
      <ImportModal
        open={importModal}
        onClose={() => setImportModal(false)}
        onDone={() => p.load()}
      />
    </div>
  )
}
