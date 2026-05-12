import { useState, useEffect } from 'react'
import { useSesiones, useRutas } from '../../../application/hooks'
import { Sesion } from '../../../domain/models'
import { Btn, Input, Table, Pagination, PageHeader, Modal, Card, Badge } from '../../components/ui/index'
import http from '../../../infrastructure/api/httpClient'

export default function SesionesPage() {
  const s = useSesiones()
  const r = useRutas()
  const [rutaId, setRutaId] = useState('')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(Sesion.empty())
  const [saving, setSaving] = useState(false)
  const [inscritos, setInscritos] = useState({})   // rutaId -> count

  useEffect(() => { if (rutaId) s.loadByRuta(rutaId) }, [rutaId])
  useEffect(() => { if (r.data.length > 0 && !rutaId) setRutaId(String(r.data[0].id)) }, [r.data])

  // Cargar inscritos por ruta al cargar rutas
  useEffect(() => {
    const fetchInscritos = async () => {
      const counts = {}
      await Promise.all(r.data.map(async ruta => {
        try {
          const res = await http.get(`/inscripciones?rutaId=${ruta.id}&page=0&size=1`)
          counts[ruta.id] = res.totalElementos || 0
        } catch { counts[ruta.id] = 0 }
      }))
      setInscritos(counts)
    }
    if (r.data.length > 0) fetchInscritos()
  }, [r.data])

  const abrirNueva = () => {
    setForm({ ...Sesion.empty(), rutaId: parseInt(rutaId) })
    setModal(true)
  }

  const abrirEditar = (sesion) => {
    setForm({ ...sesion, rutaId: parseInt(rutaId) })
    setModal(true)
  }

  const save = async () => {
    if (!form.nombre?.trim() || !form.fecha || !rutaId) return
    setSaving(true)
    try {
      if (form.id) {
        await s.actualizar(form.id, {
          nombre: form.nombre, fecha: form.fecha,
          horaInicio: form.horaInicio, horaFin: form.horaFin,
          lugar: form.lugar, encargado: form.encargado,
        })
      } else {
        await s.crear({ ...form, rutaId: parseInt(rutaId) })
      }
      setModal(false)
      setForm(Sesion.empty())
      s.loadByRuta(rutaId)
    } catch {}
    setSaving(false)
  }

  const remove = async (id) => {
    if (!confirm('¿Eliminar esta sesión?')) return
    await s.eliminar(id)
    s.loadByRuta(rutaId)
  }

  const rutaActual = r.data.find(x => String(x.id) === String(rutaId))
  const inscritosActual = rutaId ? (inscritos[parseInt(rutaId)] ?? '—') : '—'

  return (
    <div>
      <PageHeader title="Sesiones" subtitle="Programación de sesiones por ruta">
        {rutaId && <Btn icon="plus" onClick={abrirNueva}>Nueva sesión</Btn>}
      </PageHeader>

      {/* Selector de ruta */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {r.data.map(ruta => (
          <button key={ruta.id} onClick={() => setRutaId(String(ruta.id))} style={{
            padding: '8px 18px', borderRadius: 10, fontWeight: 700, fontSize: 14,
            border: '1.5px solid', cursor: 'pointer', transition: 'all .15s',
            fontFamily: "'DM Sans', sans-serif",
            borderColor: String(rutaId) === String(ruta.id) ? 'var(--gt-primary)' : 'var(--gt-border)',
            background: String(rutaId) === String(ruta.id) ? 'var(--gt-primary)' : '#fff',
            color: String(rutaId) === String(ruta.id) ? '#fff' : 'var(--gt-muted)',
          }}>
            {ruta.nombre}
          </button>
        ))}
      </div>

      {/* Info ruta seleccionada */}
      {rutaActual && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Ruta', value: rutaActual.nombre, icon: rutaActual.nombre?.includes('Fallo') ? '🔥' : '🎨' },
            { label: 'Participantes inscritos', value: inscritosActual, icon: '👥' },
            { label: 'Sesiones', value: s.data.length, icon: '📅' },
          ].map((item, i) => (
            <Card key={i} style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--gt-muted)', textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>{item.label}</p>
                <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--gt-primary)', margin: 0 }}>{item.value}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tabla */}
      {rutaId && (
        <>
          <Table
            columns={[
              { key: 'nombre',     label: 'Nombre' },
              { key: 'fecha',      label: 'Fecha' },
              { key: 'horaInicio', label: 'Inicio' },
              { key: 'horaFin',    label: 'Fin',       render: v => v || '—' },
              { key: 'lugar',      label: 'Lugar',     render: v => v || '—' },
              { key: 'encargado',  label: 'Encargado', render: v => v || '—' },
            ]}
            data={s.data}
            actions={row => (
              <div style={{ display: 'flex', gap: 6 }}>
                <Btn variant="ghost" size="sm" icon="edit" onClick={() => abrirEditar(row)} />
                <Btn variant="danger" size="sm" icon="trash" onClick={() => remove(row.id)} />
              </div>
            )}
          />
          <Pagination page={s.page} totalPages={s.totalPages} onChange={p => s.loadByRuta(rutaId, p)} />
        </>
      )}

      {!rutaId && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gt-muted)' }}>
          <p style={{ fontSize: 32 }}>📅</p>
          <p style={{ fontWeight: 700 }}>Selecciona una ruta para ver sus sesiones</p>
        </div>
      )}

      {/* Modal crear/editar */}
      <Modal open={modal} onClose={() => setModal(false)} title={form.id ? 'Editar sesión' : 'Nueva sesión'}>
        <Input label="Nombre de la sesión *" value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })}
          placeholder="Ej. Sesión 1 – Introducción" autoFocus />
        <Input label="Fecha *" type="date" value={form.fecha}
          onChange={e => setForm({ ...form, fecha: e.target.value })} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input label="Hora inicio" type="time" value={form.horaInicio}
            onChange={e => setForm({ ...form, horaInicio: e.target.value })} />
          <Input label="Hora fin" type="time" value={form.horaFin}
            onChange={e => setForm({ ...form, horaFin: e.target.value })} />
        </div>
        <Input label="Lugar" value={form.lugar || ''}
          onChange={e => setForm({ ...form, lugar: e.target.value })}
          placeholder="Ej. Cancha C, Aula 201" />
        <Input label="Encargado" value={form.encargado || ''}
          onChange={e => setForm({ ...form, encargado: e.target.value })}
          placeholder="Nombre del encargado de la sesión" />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>Cancelar</Btn>
          <Btn onClick={save} disabled={saving || !form.nombre?.trim() || !form.fecha}>
            {saving ? 'Guardando...' : form.id ? 'Guardar cambios' : 'Crear sesión'}
          </Btn>
        </div>
      </Modal>
    </div>
  )
}
