package com.gimnasio.transmoderno.inscripciones.domain.usecase;

import com.gimnasio.transmoderno.inscripciones.domain.exception.InscripcionNoEncontradaException;
import com.gimnasio.transmoderno.inscripciones.domain.model.EstadoInscripcion;
import com.gimnasio.transmoderno.inscripciones.domain.model.Inscripcion;
import com.gimnasio.transmoderno.inscripciones.domain.model.port.InscripcionRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class FinalizarInscripcionUseCase {

    private final InscripcionRepository inscripcionRepository;

    public void ejecutar(Long id) {
        Inscripcion inscripcion = inscripcionRepository.findById(id)
                .orElseThrow(() -> new InscripcionNoEncontradaException(id.toString()));

        inscripcion.setEstado(EstadoInscripcion.FINALIZADA);
        inscripcionRepository.save(inscripcion);
    }
}