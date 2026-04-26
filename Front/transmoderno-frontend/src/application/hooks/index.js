import { useState, useEffect, useCallback } from 'react'
import { useToast } from '../context/ToastContext'
import * as uc from '../../domain/usecases'
import * as repos from '../../infrastructure/repositories'

// ── Helper: ejecutar con manejo de error ──
export function useAction() {
  const toast = useToast()
  return useCallback(async (fn, okMsg) => {
    try {
      const r = await fn()
      if (okMsg) toast(okMsg)
      return r
    } catch (e) {
      toast(e.mensaje || 'Error inesperado', 'error')
      throw e
    }
  }, [toast])
}

// ── Participantes ──
export function useParticipantes() {
  const cases = uc.participanteUseCases(repos.participanteRepo)
  const run = useAction()
  const [data, setData] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const load = useCallback(async (p = 0) => {
    const r = await cases.listar(p, 10)
    setData(r.contenido || []); setPage(r.paginaActual || 0); setTotalPages(r.totalPaginas || 0)
  }, [])

  useEffect(() => { load() }, [])

  return {
    data, page, totalPages, load,
    buscar: (n) => run(() => cases.buscar(n)).then(r => { setData([r]); setTotalPages(1) }),
    registrar: (d) => run(() => cases.registrar(d), 'Participante registrado').then(() => load()),
    actualizar: (id, d) => run(() => cases.actualizar(id, d), 'Participante actualizado').then(() => load()),
    desactivar: (id) => run(() => cases.desactivar(id), 'Participante desactivado').then(() => load())
  }
}

// ── Rutas ──
export function useRutas() {
  const cases = uc.rutaUseCases(repos.rutaRepo)
  const run = useAction()
  const [data, setData] = useState([])

  const load = useCallback(async () => { try { setData(await cases.listar()) } catch {} }, [])
  useEffect(() => { load() }, [])

  return {
    data, load,
    crear: (d) => run(() => cases.crear(d), 'Ruta creada').then(load),
    actualizar: (id, d) => run(() => cases.actualizar(id, d), 'Ruta actualizada').then(load),
    desactivar: (id) => run(() => cases.desactivar(id), 'Ruta desactivada').then(load),
    reactivar: (id) => run(() => cases.reactivar(id), 'Ruta reactivada').then(load)
  }
}

// ── Sesiones ──
export function useSesiones() {
  const cases = uc.sesionUseCases(repos.sesionRepo)
  const run = useAction()
  const [data, setData] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const loadByRuta = useCallback(async (rId, p = 0) => {
    if (!rId) { setData([]); return }
    try {
      const r = await cases.listarPorRuta(rId, p, 10)
      setData(r.contenido || []); setPage(r.paginaActual || 0); setTotalPages(r.totalPaginas || 0)
    } catch { setData([]) }
  }, [])

  return {
    data, page, totalPages, loadByRuta,
    obtenerActiva: (rId) => run(() => cases.obtenerActiva(rId)),
    crear: (d) => run(() => cases.crear(d), 'Sesión creada'),
    eliminar: (id) => run(() => cases.eliminar(id), 'Sesión eliminada')
  }
}

// ── Inscripciones ──
export function useInscripciones() {
  const cases = uc.inscripcionUseCases(repos.inscripcionRepo)
  const run = useAction()
  const [data, setData] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const load = useCallback(async (p = 0) => {
    const r = await cases.listar(p, 10)
    setData(r.contenido || []); setPage(r.paginaActual || 0); setTotalPages(r.totalPaginas || 0)
  }, [])

  useEffect(() => { load() }, [])

  return {
    data, page, totalPages, load,
    buscarPorParticipante: (n) => run(() => cases.listarPorParticipante(n)),
    inscribir: (n, rId) => run(() => cases.inscribir(n, rId), 'Inscripción exitosa').then(() => load()),
    finalizar: (id) => run(() => cases.finalizar(id), 'Inscripción finalizada').then(() => load())
  }
}

// ── Asistencia ──
export function useAsistencia() {
  const cases = uc.asistenciaUseCases(repos.asistenciaRepo)
  const run = useAction()
  return {
    registrar: (n, rId) => run(() => cases.registrar(n, rId), 'Asistencia registrada'),
    listarPorSesion: (sId, p) => run(() => cases.listarPorSesion(sId, p, 10)),
    listarPorParticipante: (n, p) => run(() => cases.listarPorParticipante(n, p, 10))
  }
}

// ── Preguntas ──
export function usePreguntas() {
  const cases = uc.preguntaUseCases(repos.preguntaRepo)
  const run = useAction()
  const [data, setData] = useState([])

  const loadByRuta = useCallback(async (rId) => {
    if (!rId) { setData([]); return }
    try { setData(await cases.listarPorRuta(rId)) } catch { setData([]) }
  }, [])

  return {
    data, loadByRuta,
    crear: (d) => run(() => cases.crear(d), 'Pregunta creada'),
    actualizar: (id, d) => run(() => cases.actualizar(id, d), 'Pregunta actualizada'),
    desactivar: (id) => run(() => cases.desactivar(id), 'Pregunta desactivada')
  }
}

// ── Fichas ──
export function useFichas() {
  const cases = uc.fichaUseCases(repos.fichaRepo)
  const run = useAction()
  return {
    crearPre: (d) => run(() => cases.crearPre(d), 'Ficha PRE creada'),
    crearPost: (d) => run(() => cases.crearPost(d), 'Ficha POST creada'),
    obtenerPre: (id) => run(() => cases.obtenerPre(id)),
    obtenerPost: (id) => run(() => cases.obtenerPost(id))
  }
}

// ── Alertas ──
export function useAlertas() {
  const cases = uc.alertaUseCases(repos.alertaRepo)
  const run = useAction()
  const [solicitudes, setSolicitudes] = useState([])
  const [solPage, setSolPage] = useState(0)
  const [solTotalPages, setSolTotalPages] = useState(0)
  const [inasistencias, setInasistencias] = useState([])

  const loadSolicitudes = useCallback(async (p = 0) => {
    try {
      const r = await cases.listarSolicitudes(p, 10)
      setSolicitudes(r.contenido || []); setSolPage(r.paginaActual || 0); setSolTotalPages(r.totalPaginas || 0)
    } catch {}
  }, [])

  const loadInasistencias = useCallback(async () => {
    try { setInasistencias(await cases.listarInasistencias()) } catch {}
  }, [])

  useEffect(() => { loadSolicitudes(); loadInasistencias() }, [])

  return {
    solicitudes, solPage, solTotalPages, loadSolicitudes,
    inasistencias, loadInasistencias,
    crearSolicitud: (n) => run(() => cases.crearSolicitud(n), 'Solicitud enviada').then(() => loadSolicitudes()),
    atender: (id) => run(() => cases.atender(id), 'Solicitud atendida').then(() => loadSolicitudes())
  }
}

// ── Usuarios ──
export function useUsuarios() {
  const cases = uc.usuarioUseCases(repos.usuarioRepo)
  const run = useAction()
  const [data, setData] = useState([])

  const load = useCallback(async () => { try { setData(await cases.listar()) } catch {} }, [])
  useEffect(() => { load() }, [])

  return {
    data, load,
    registrar: (d) => run(() => cases.registrar(d), 'Usuario registrado').then(load),
    actualizar: (id, d) => run(() => cases.actualizar(id, d), 'Usuario actualizado').then(load),
    cambiarContrasena: (id, p) => run(() => cases.cambiarContrasena(id, p), 'Contraseña actualizada'),
    desactivar: (id) => run(() => cases.desactivar(id), 'Usuario desactivado').then(load)
  }
}

// ── Reportes ──
export function useReportes() {
  const cases = uc.reporteUseCases(repos.reporteRepo)
  const run = useAction()
  return {
    asistenciaSesiones: (rId, d, h) => run(() => cases.asistenciaSesiones(rId, d, h)),
    asistenciaRuta: (rId) => run(() => cases.asistenciaRuta(rId)),
    comparativo: (rId) => run(() => cases.comparativo(rId))
  }
}
