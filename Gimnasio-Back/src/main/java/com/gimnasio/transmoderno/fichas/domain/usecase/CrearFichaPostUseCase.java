package com.gimnasio.transmoderno.fichas.domain.usecase;

import com.gimnasio.transmoderno.fichas.domain.exception.FichaPostYaExisteException;
import com.gimnasio.transmoderno.fichas.domain.exception.FichaPreNoCompletadaException;
import com.gimnasio.transmoderno.fichas.domain.exception.FichaPreNoEncontradaException;
import com.gimnasio.transmoderno.fichas.domain.model.FichaPost;
import com.gimnasio.transmoderno.fichas.domain.model.port.FichaPostRepository;
import com.gimnasio.transmoderno.fichas.domain.model.port.FichaPreRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CrearFichaPostUseCase {

    private final FichaPostRepository fichaPostRepository;
    private final FichaPreRepository fichaPreRepository;

    public FichaPost ejecutar(FichaPost fichaPost) {
        var fichaPre = fichaPreRepository.findById(fichaPost.getFichaPreId())
                .orElseThrow(() -> new FichaPreNoEncontradaException(
                        fichaPost.getFichaPreId().toString()));

        if (!fichaPre.getCompletada()) {
            throw new FichaPreNoCompletadaException();
        }

        fichaPostRepository.findByFichaPreId(fichaPost.getFichaPreId())
                .ifPresent(f -> { throw new FichaPostYaExisteException(); });

        fichaPost.setCompletada(true);
        return fichaPostRepository.save(fichaPost);
    }
}