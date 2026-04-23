package com.gimnasio.transmoderno.fichas.domain.usecase;

import com.gimnasio.transmoderno.fichas.domain.exception.FichaPreYaExisteException;
import com.gimnasio.transmoderno.fichas.domain.model.FichaPre;
import com.gimnasio.transmoderno.fichas.domain.model.port.FichaPreRepository;
import com.gimnasio.transmoderno.inscripciones.domain.exception.InscripcionNoEncontradaException;
import com.gimnasio.transmoderno.inscripciones.domain.model.EstadoInscripcion;
import com.gimnasio.transmoderno.inscripciones.domain.model.port.InscripcionRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CrearFichaPreUseCase {

    private final FichaPreRepository fichaPreRepository;
    private final InscripcionRepository inscripcionRepository;

    public FichaPre ejecutar(FichaPre fichaPre) {
        var inscripcion = inscripcionRepository.findById(fichaPre.getInscripcionId())
                .orElseThrow(() -> new InscripcionNoEncontradaException(
                        fichaPre.getInscripcionId().toString()));

        if (inscripcion.getEstado() != EstadoInscripcion.ACTIVA) {
            throw new InscripcionNoEncontradaException("La inscripción no está activa");
        }

        fichaPreRepository.findByInscripcionId(fichaPre.getInscripcionId())
                .ifPresent(f -> { throw new FichaPreYaExisteException(); });

        fichaPre.setCompletada(true);
        return fichaPreRepository.save(fichaPre);
    }
}