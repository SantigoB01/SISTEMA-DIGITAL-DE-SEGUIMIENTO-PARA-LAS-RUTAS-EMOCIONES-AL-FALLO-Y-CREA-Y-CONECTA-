package com.gimnasio.transmoderno.asistencia.domain.usecase;

import com.gimnasio.transmoderno.asistencia.domain.exception.AsistenciaYaRegistradaException;
import com.gimnasio.transmoderno.asistencia.domain.exception.ParticipanteNoInscritoException;
import com.gimnasio.transmoderno.asistencia.domain.model.RegistroAsistencia;
import com.gimnasio.transmoderno.asistencia.domain.model.port.RegistroAsistenciaRepository;
import com.gimnasio.transmoderno.inscripciones.domain.model.EstadoInscripcion;
import com.gimnasio.transmoderno.inscripciones.domain.model.port.InscripcionRepository;
import com.gimnasio.transmoderno.participantes.domain.exception.ParticipanteNoEncontradoException;
import com.gimnasio.transmoderno.participantes.domain.model.port.ParticipanteRepository;
import com.gimnasio.transmoderno.sesiones.domain.exception.SesionNoActivaException;
import com.gimnasio.transmoderno.sesiones.domain.model.port.SesionRepository;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@RequiredArgsConstructor
public class RegistrarAsistenciaUseCase {

    private final RegistroAsistenciaRepository registroAsistenciaRepository;
    private final ParticipanteRepository participanteRepository;
    private final SesionRepository sesionRepository;
    private final InscripcionRepository inscripcionRepository;

    public RegistroAsistencia ejecutar(String numeroIdentificacion, Long rutaId) {
        var participante = participanteRepository
                .findByNumeroIdentificacion(numeroIdentificacion)
                .orElseThrow(() -> new ParticipanteNoEncontradoException(numeroIdentificacion));

        var sesion = sesionRepository
                .findSesionActiva(rutaId, LocalDate.now(), LocalTime.now())
                .orElseThrow(SesionNoActivaException::new);

        inscripcionRepository
                .findByParticipanteIdAndRutaId(participante.getId(), rutaId)
                .filter(i -> i.getEstado() == EstadoInscripcion.ACTIVA)
                .orElseThrow(ParticipanteNoInscritoException::new);

        registroAsistenciaRepository
                .findByParticipanteIdAndSesionId(participante.getId(), sesion.getId())
                .ifPresent(r -> { throw new AsistenciaYaRegistradaException(); });

        RegistroAsistencia registro = RegistroAsistencia.builder()
                .participanteId(participante.getId())
                .sesionId(sesion.getId())
                .build();

        return registroAsistenciaRepository.save(registro);
    }
}