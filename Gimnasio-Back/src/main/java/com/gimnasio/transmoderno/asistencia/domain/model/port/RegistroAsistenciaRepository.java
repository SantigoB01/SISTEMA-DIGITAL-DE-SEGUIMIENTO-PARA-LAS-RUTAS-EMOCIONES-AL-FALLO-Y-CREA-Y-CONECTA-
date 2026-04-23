package com.gimnasio.transmoderno.asistencia.domain.model.port;

import com.gimnasio.transmoderno.asistencia.domain.model.RegistroAsistencia;
import java.util.List;
import java.util.Optional;

public interface RegistroAsistenciaRepository {
    RegistroAsistencia save(RegistroAsistencia registro);
    Optional<RegistroAsistencia> findByParticipanteIdAndSesionId(Long participanteId, Long sesionId);
    List<RegistroAsistencia> findBySesionId(Long sesionId, int page, int size);
    long countBySesionId(Long sesionId);
    List<RegistroAsistencia> findByParticipanteId(Long participanteId, int page, int size);
    long countByParticipanteId(Long participanteId);
}