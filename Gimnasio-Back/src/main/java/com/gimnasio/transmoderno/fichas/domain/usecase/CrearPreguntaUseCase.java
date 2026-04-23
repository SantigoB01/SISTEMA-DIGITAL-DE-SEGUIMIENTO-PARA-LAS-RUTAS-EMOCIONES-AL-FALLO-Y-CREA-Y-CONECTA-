package com.gimnasio.transmoderno.fichas.domain.usecase;

import com.gimnasio.transmoderno.fichas.domain.model.Pregunta;
import com.gimnasio.transmoderno.fichas.domain.model.port.PreguntaRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CrearPreguntaUseCase {

    private final PreguntaRepository preguntaRepository;

    public Pregunta ejecutar(Pregunta pregunta) {
        return preguntaRepository.save(pregunta);
    }
}