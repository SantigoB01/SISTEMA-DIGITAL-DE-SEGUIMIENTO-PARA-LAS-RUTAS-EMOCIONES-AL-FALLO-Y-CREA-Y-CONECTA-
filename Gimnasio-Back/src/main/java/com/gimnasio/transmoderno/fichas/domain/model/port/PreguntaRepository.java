package com.gimnasio.transmoderno.fichas.domain.model.port;

import com.gimnasio.transmoderno.fichas.domain.model.Pregunta;
import java.util.List;
import java.util.Optional;

public interface PreguntaRepository {
    Pregunta save(Pregunta pregunta);
    Optional<Pregunta> findById(Long id);
    List<Pregunta> findByRutaId(Long rutaId);
    List<Pregunta> findByRutaIdAndActivaTrue(Long rutaId);
}