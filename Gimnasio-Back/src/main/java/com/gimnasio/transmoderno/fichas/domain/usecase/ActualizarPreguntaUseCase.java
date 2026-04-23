package com.gimnasio.transmoderno.fichas.domain.usecase;

import com.gimnasio.transmoderno.fichas.domain.exception.PreguntaNoEncontradaException;
import com.gimnasio.transmoderno.fichas.domain.model.Pregunta;
import com.gimnasio.transmoderno.fichas.domain.model.port.PreguntaRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ActualizarPreguntaUseCase {

    private final PreguntaRepository preguntaRepository;

    public Pregunta ejecutar(Long id, Pregunta preguntaActualizada) {
        Pregunta existente = preguntaRepository.findById(id)
                .orElseThrow(() -> new PreguntaNoEncontradaException(id.toString()));

        existente.setTexto(preguntaActualizada.getTexto());
        existente.setOrden(preguntaActualizada.getOrden());

        return preguntaRepository.save(existente);
    }
}