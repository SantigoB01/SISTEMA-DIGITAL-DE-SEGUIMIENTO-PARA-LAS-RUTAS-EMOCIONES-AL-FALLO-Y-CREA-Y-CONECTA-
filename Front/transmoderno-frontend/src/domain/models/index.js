export const Participante = {
  empty: () => ({ id: null, numeroIdentificacion: '', nombreCompleto: '', correoInstitucional: '', programaAcademico: '', semestre: '', activo: true })
}

export const Ruta = {
  empty: () => ({ id: null, nombre: '', descripcion: '', activa: true })
}

export const Sesion = {
  empty: () => ({ id: null, rutaId: null, nombre: '', fecha: '', horaInicio: '', horaFin: '' })
}

export const Inscripcion = {
  empty: () => ({ id: null, participanteId: null, rutaId: null, fechaInscripcion: null, estado: 'ACTIVA' })
}

export const Usuario = {
  empty: () => ({ id: null, nombre: '', correo: '', contrasena: '', rol: '', activo: true }),
  roles: [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'PSICOLOGO', label: 'Psicólogo' },
    { value: 'ENCARGADO', label: 'Encargado' }
  ]
}

export const Pregunta = {
  empty: () => ({ id: null, rutaId: null, texto: '', orden: 1, activa: true })
}
