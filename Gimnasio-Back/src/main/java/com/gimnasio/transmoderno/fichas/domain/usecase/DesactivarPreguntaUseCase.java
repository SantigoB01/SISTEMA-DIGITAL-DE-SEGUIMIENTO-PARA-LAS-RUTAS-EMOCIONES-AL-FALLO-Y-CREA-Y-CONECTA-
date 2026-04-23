package com.gimnasio.transmoderno.fichas.domain.usecase;

import com.gimnasio.transmoderno.fichas.domain.exception.PreguntaNoEncontradaException;
import com.gimnasio.transmoderno.fichas.domain.model.Pregunta;
import com.gimnasio.transmoderno.fichas.domain.model.port.PreguntaRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class DesactivarPreguntaUseCase {

    private final PreguntaRepository preguntaRepository;

    public void ejecutar(Long id) {
        Pregunta pregunta = preguntaRepository.findById(id)
                .orElseThrow(() -> new PreguntaNoEncontradaException(id.toString()));
        pregunta.setActiva(false);
        preguntaRepository.save(pregunta);
    }
}