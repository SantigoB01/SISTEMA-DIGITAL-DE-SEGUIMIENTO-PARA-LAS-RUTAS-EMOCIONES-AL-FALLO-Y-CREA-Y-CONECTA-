import http from '../api/httpClient'

export const participanteRepo = {
  findAll: (page = 0, size = 10) => http.get(`/participantes?page=${page}&size=${size}`),
  findByIdentificacion: (n) => http.get(`/participantes/identificacion/${n}`),
  save: (d) => http.post('/participantes', d),
  update: (id, d) => http.put(`/participantes/${id}`, d),
  deactivate: (id) => http.del(`/participantes/${id}`)
}

export const rutaRepo = {
  findAll: () => http.get('/rutas'),
  save: (d) => http.post('/rutas', d),
  update: (id, d) => http.put(`/rutas/${id}`, d),
  deactivate: (id) => http.del(`/rutas/${id}`),
  reactivate: (id) => http.patch(`/rutas/${id}/reactivar`)
}

export const sesionRepo = {
  findByRuta: (rId, p = 0, s = 10) => http.get(`/sesiones/ruta/${rId}?page=${p}&size=${s}`),
  findActiva: (rId) => http.get(`/sesiones/activa/${rId}`),
  save: (d) => http.post('/sesiones', d),
  remove: (id) => http.del(`/sesiones/${id}`)
}

export const inscripcionRepo = {
  findAll: (p = 0, s = 10) => http.get(`/inscripciones?page=${p}&size=${s}`),
  findByParticipante: (n) => http.get(`/inscripciones/participante/${n}`),
  inscribir: (n, rId) => http.post('/inscripciones', { numeroIdentificacion: n, rutaId: rId }),
  finalizar: (id) => http.patch(`/inscripciones/${id}/finalizar`)
}

export const asistenciaRepo = {
  registrar: (n, rId) => http.post('/asistencia', { numeroIdentificacion: n, rutaId: rId }),
  findBySesion: (sId, p = 0, s = 10) => http.get(`/asistencia/sesion/${sId}?page=${p}&size=${s}`),
  findByParticipante: (n, p = 0, s = 10) => http.get(`/asistencia/participante/${n}?page=${p}&size=${s}`)
}

export const preguntaRepo = {
  findByRuta: (rId) => http.get(`/preguntas/ruta/${rId}`),
  save: (d) => http.post('/preguntas', d),
  update: (id, d) => http.put(`/preguntas/${id}`, d),
  deactivate: (id) => http.del(`/preguntas/${id}`)
}

export const fichaRepo = {
  crearPre: (d) => http.post('/fichas/pre', d),
  crearPost: (d) => http.post('/fichas/post', d),
  findPreByInscripcion: (id) => http.get(`/fichas/pre/inscripcion/${id}`),
  findPostByFichaPre: (id) => http.get(`/fichas/post/inscripcion/${id}`)
}

export const alertaRepo = {
  crearSolicitud: (n) => http.post('/alertas/ayuda', { numeroIdentificacion: n }),
  findSolicitudes: (p = 0, s = 10) => http.get(`/alertas/ayuda?page=${p}&size=${s}`),
  atender: (id) => http.patch(`/alertas/ayuda/${id}/atender`),
  findInasistencias: () => http.get('/alertas/inasistencia')
}

export const usuarioRepo = {
  findAll: () => http.get('/auth/usuarios'),
  registrar: (d) => http.post('/auth/registro', d),
  update: (id, d) => http.put(`/auth/usuarios/${id}`, d),
  cambiarContrasena: (id, pwd) => http.patch(`/auth/usuarios/${id}/contrasena`, { contrasena: pwd }),
  deactivate: (id) => http.del(`/auth/usuarios/${id}`),
  login: (correo, pwd) => http.post('/auth/login', { correo, contrasena: pwd })
}

export const reporteRepo = {
  asistenciaSesiones: (rId, desde, hasta) => {
    const q = [desde && `desde=${desde}`, hasta && `hasta=${hasta}`].filter(Boolean).join('&')
    return http.get(`/reportes/asistencia/sesiones/${rId}${q ? '?' + q : ''}`)
  },
  asistenciaRuta: (rId) => http.get(`/reportes/asistencia/ruta/${rId}`),
  comparativo: (rId) => http.get(`/reportes/comparativo/${rId}`)
}
