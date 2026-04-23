package com.gimnasio.transmoderno.inscripciones.domain.usecase;

import com.gimnasio.transmoderno.inscripciones.domain.model.EstadoInscripcion;
import com.gimnasio.transmoderno.inscripciones.domain.model.port.InscripcionRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class DesactivarInscripcionesPorParticipanteUseCase {

    private final InscripcionRepository inscripcionRepository;

    public void ejecutar(Long participanteId) {
        inscripcionRepository.findByParticipanteId(participanteId)
                .stream()
                .filter(i -> i.getEstado() == EstadoInscripcion.ACTIVA)
                .forEach(i -> {
                    i.setEstado(EstadoInscripcion.INACTIVA);
                    inscripcionRepository.save(i);
                });
    }
}