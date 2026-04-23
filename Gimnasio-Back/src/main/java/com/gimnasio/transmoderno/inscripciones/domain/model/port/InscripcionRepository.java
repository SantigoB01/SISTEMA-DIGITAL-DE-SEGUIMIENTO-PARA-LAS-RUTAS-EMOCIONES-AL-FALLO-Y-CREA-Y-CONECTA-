package com.gimnasio.transmoderno.inscripciones.domain.model.port;

import com.gimnasio.transmoderno.inscripciones.domain.model.EstadoInscripcion;
import com.gimnasio.transmoderno.inscripciones.domain.model.Inscripcion;
import java.util.List;
import java.util.Optional;

public interface InscripcionRepository {
    Inscripcion save(Inscripcion inscripcion);
    Optional<Inscripcion> findById(Long id);
    List<Inscripcion> findAll(int page, int size);
    long count();
    List<Inscripcion> findByParticipanteId(Long participanteId);
    Optional<Inscripcion> findByParticipanteIdAndRutaId(Long participanteId, Long rutaId);
    long countByRutaId(Long rutaId);
    long countByRutaIdAndEstado(Long rutaId, EstadoInscripcion estado);
}