package com.gimnasio.transmoderno.participantes.infrastructure.driver_adapters.jpa_repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ParticipanteJpaRepository extends JpaRepository<ParticipanteData, Long> {
    Optional<ParticipanteData> findByNumeroIdentificacion(String numeroIdentificacion);
    Page<ParticipanteData> findAll(Pageable pageable);
    Page<ParticipanteData> findByNombreCompletoContainingIgnoreCase(String nombre, Pageable pageable);
    long countByNombreCompletoContainingIgnoreCase(String nombre);
}