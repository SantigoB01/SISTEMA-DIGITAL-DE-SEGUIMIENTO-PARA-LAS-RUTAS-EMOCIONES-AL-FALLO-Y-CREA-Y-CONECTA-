package com.gimnasio.transmoderno.inscripciones.domain.usecase;

import com.gimnasio.transmoderno.inscripciones.domain.model.EstadoInscripcion;
import com.gimnasio.transmoderno.inscripciones.domain.model.port.InscripcionRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CerrarSemestreUseCase {

    private final InscripcionRepository inscripcionRepository;

    public int ejecutar() {
        var activas = inscripcionRepository.findAll(0, Integer.MAX_VALUE)
                .stream()
                .filter(i -> i.getEstado() == EstadoInscripcion.ACTIVA)
                .toList();

        activas.forEach(i -> {
            i.setEstado(EstadoInscripcion.FINALIZADA);
            inscripcionRepository.save(i);
        });

        return activas.size();
    }
}