package com.gimnasio.transmoderno.fichas.domain.usecase;

import com.gimnasio.transmoderno.fichas.domain.model.Pregunta;
import com.gimnasio.transmoderno.fichas.domain.model.port.PreguntaRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class ObtenerPreguntasPorRutaUseCase {

    private final PreguntaRepository preguntaRepository;

    public List<Pregunta> ejecutar(Long rutaId) {
        return preguntaRepository.findByRutaIdAndActivaTrue(rutaId);
    }
}