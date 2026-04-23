package com.gimnasio.transmoderno.asistencia.infrastructure.driver_adapters.jpa_repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RegistroAsistenciaJpaRepository extends JpaRepository<RegistroAsistenciaData, Long> {
    Optional<RegistroAsistenciaData> findByParticipanteIdAndSesionId(Long participanteId, Long sesionId);
    Page<RegistroAsistenciaData> findBySesionId(Long sesionId, Pageable pageable);
    long countBySesionId(Long sesionId);
    Page<RegistroAsistenciaData> findByParticipanteId(Long participanteId, Pageable pageable);
    long countByParticipanteId(Long participanteId);
}