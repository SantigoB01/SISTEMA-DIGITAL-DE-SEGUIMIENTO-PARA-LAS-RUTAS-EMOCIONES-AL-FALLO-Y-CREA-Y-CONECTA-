package com.gimnasio.transmoderno.inscripciones.infrastructure.driver_adapters.jpa_repository;

import com.gimnasio.transmoderno.inscripciones.domain.model.EstadoInscripcion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface InscripcionJpaRepository extends JpaRepository<InscripcionData, Long> {
    Page<InscripcionData> findAll(Pageable pageable);
    List<InscripcionData> findByParticipanteId(Long participanteId);
    Optional<InscripcionData> findByParticipanteIdAndRutaId(Long participanteId, Long rutaId);
    long countByRutaId(Long rutaId);
    long countByRutaIdAndEstado(Long rutaId, EstadoInscripcion estado);
}