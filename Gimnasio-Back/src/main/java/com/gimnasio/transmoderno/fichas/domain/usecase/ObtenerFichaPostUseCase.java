package com.gimnasio.transmoderno.fichas.domain.usecase;

import com.gimnasio.transmoderno.fichas.domain.exception.FichaPostNoEncontradaException;
import com.gimnasio.transmoderno.fichas.domain.model.FichaPost;
import com.gimnasio.transmoderno.fichas.domain.model.port.FichaPostRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ObtenerFichaPostUseCase {

    private final FichaPostRepository fichaPostRepository;

    public FichaPost ejecutar(Long fichaPreId) {
        return fichaPostRepository.findByFichaPreId(fichaPreId)
                .orElseThrow(() -> new FichaPostNoEncontradaException(fichaPreId.toString()));
    }
}