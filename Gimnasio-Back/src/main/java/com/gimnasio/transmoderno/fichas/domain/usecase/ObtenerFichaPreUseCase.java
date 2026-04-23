package com.gimnasio.transmoderno.fichas.domain.usecase;

import com.gimnasio.transmoderno.fichas.domain.exception.FichaPreNoEncontradaException;
import com.gimnasio.transmoderno.fichas.domain.model.FichaPre;
import com.gimnasio.transmoderno.fichas.domain.model.port.FichaPreRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ObtenerFichaPreUseCase {

    private final FichaPreRepository fichaPreRepository;

    public FichaPre ejecutar(Long inscripcionId) {
        return fichaPreRepository.findByInscripcionId(inscripcionId)
                .orElseThrow(() -> new FichaPreNoEncontradaException(inscripcionId.toString()));
    }
}