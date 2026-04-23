package com.gimnasio.transmoderno.inscripciones.domain.usecase;

import com.gimnasio.transmoderno.inscripciones.domain.exception.ParticipanteYaInscritoException;
import com.gimnasio.transmoderno.inscripciones.domain.exception.RutaNoActivaException;
import com.gimnasio.transmoderno.inscripciones.domain.model.EstadoInscripcion;
import com.gimnasio.transmoderno.inscripciones.domain.model.Inscripcion;
import com.gimnasio.transmoderno.inscripciones.domain.model.port.InscripcionRepository;
import com.gimnasio.transmoderno.participantes.domain.exception.ParticipanteNoEncontradoException;
import com.gimnasio.transmoderno.participantes.domain.model.port.ParticipanteRepository;
import com.gimnasio.transmoderno.rutas.domain.exception.RutaNoEncontradaException;
import com.gimnasio.transmoderno.rutas.domain.model.port.RutaRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class InscribirParticipanteUseCase {

    private final InscripcionRepository inscripcionRepository;
    private final ParticipanteRepository participanteRepository;
    private final RutaRepository rutaRepository;

    public Inscripcion ejecutar(String numeroIdentificacion, Long rutaId) {
        var participante = participanteRepository
                .findByNumeroIdentificacion(numeroIdentificacion)
                .orElseThrow(() -> new ParticipanteNoEncontradoException(numeroIdentificacion));

        var ruta = rutaRepository.findById(rutaId)
                .orElseThrow(() -> new RutaNoEncontradaException(rutaId.toString()));

        if (!ruta.getActiva()) {
            throw new RutaNoActivaException();
        }

        var inscripcionExistente = inscripcionRepository
                .findByParticipanteIdAndRutaId(participante.getId(), rutaId);

        if (inscripcionExistente.isPresent()) {
            Inscripcion inscripcion = inscripcionExistente.get();
            if (inscripcion.getEstado() == EstadoInscripcion.ACTIVA) {
                throw new ParticipanteYaInscritoException();
            }
            // Reactivar inscripción INACTIVA o FINALIZADA
            inscripcion.setEstado(EstadoInscripcion.ACTIVA);
            return inscripcionRepository.save(inscripcion);
        }

        Inscripcion inscripcion = Inscripcion.builder()
                .participanteId(participante.getId())
                .rutaId(rutaId)
                .estado(EstadoInscripcion.ACTIVA)
                .build();

        return inscripcionRepository.save(inscripcion);
    }
}