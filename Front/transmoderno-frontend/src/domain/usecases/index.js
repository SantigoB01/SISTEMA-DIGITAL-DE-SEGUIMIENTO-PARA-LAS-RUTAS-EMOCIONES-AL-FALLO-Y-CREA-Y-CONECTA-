export const participanteUseCases = (repo) => ({
  listar: (page, size) => repo.findAll(page, size),
  buscar: (numero) => repo.findByIdentificacion(numero),
  registrar: (data) => repo.save(data),
  actualizar: (id, data) => repo.update(id, data),
  desactivar: (id) => repo.deactivate(id)
})

export const rutaUseCases = (repo) => ({
  listar: () => repo.findAll(),
  crear: (data) => repo.save(data),
  actualizar: (id, data) => repo.update(id, data),
  desactivar: (id) => repo.deactivate(id),
  reactivar: (id) => repo.reactivate(id)
})

export const sesionUseCases = (repo) => ({
  listarPorRuta: (rutaId, page, size) => repo.findByRuta(rutaId, page, size),
  obtenerActiva: (rutaId) => repo.findActiva(rutaId),
  crear: (data) => repo.save(data),
  eliminar: (id) => repo.remove(id)
})

export const inscripcionUseCases = (repo) => ({
  listar: (page, size) => repo.findAll(page, size),
  listarPorParticipante: (numero) => repo.findByParticipante(numero),
  inscribir: (numero, rutaId) => repo.inscribir(numero, rutaId),
  finalizar: (id) => repo.finalizar(id)
})

export const asistenciaUseCases = (repo) => ({
  registrar: (numero, rutaId) => repo.registrar(numero, rutaId),
  listarPorSesion: (sesionId, page, size) => repo.findBySesion(sesionId, page, size),
  listarPorParticipante: (numero, page, size) => repo.findByParticipante(numero, page, size)
})

export const preguntaUseCases = (repo) => ({
  listarPorRuta: (rutaId) => repo.findByRuta(rutaId),
  crear: (data) => repo.save(data),
  actualizar: (id, data) => repo.update(id, data),
  desactivar: (id) => repo.deactivate(id)
})

export const fichaUseCases = (repo) => ({
  crearPre: (data) => repo.crearPre(data),
  crearPost: (data) => repo.crearPost(data),
  obtenerPre: (inscripcionId) => repo.findPreByInscripcion(inscripcionId),
  obtenerPost: (fichaPreId) => repo.findPostByFichaPre(fichaPreId)
})

export const alertaUseCases = (repo) => ({
  crearSolicitud: (numero) => repo.crearSolicitud(numero),
  listarSolicitudes: (page, size) => repo.findSolicitudes(page, size),
  atender: (id) => repo.atender(id),
  listarInasistencias: () => repo.findInasistencias()
})

export const usuarioUseCases = (repo) => ({
  listar: () => repo.findAll(),
  registrar: (data) => repo.registrar(data),
  actualizar: (id, data) => repo.update(id, data),
  cambiarContrasena: (id, pwd) => repo.cambiarContrasena(id, pwd),
  desactivar: (id) => repo.deactivate(id),
  login: (correo, pwd) => repo.login(correo, pwd)
})

export const reporteUseCases = (repo) => ({
  asistenciaSesiones: (rutaId, desde, hasta) => repo.asistenciaSesiones(rutaId, desde, hasta),
  asistenciaRuta: (rutaId) => repo.asistenciaRuta(rutaId),
  comparativo: (rutaId) => repo.comparativo(rutaId)
})
