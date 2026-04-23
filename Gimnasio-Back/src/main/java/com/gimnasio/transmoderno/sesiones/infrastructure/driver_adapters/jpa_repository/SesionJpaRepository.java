package com.gimnasio.transmoderno.sesiones.infrastructure.driver_adapters.jpa_repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

public interface SesionJpaRepository extends JpaRepository<SesionData, Long> {

    Page<SesionData> findByRutaId(Long rutaId, Pageable pageable);

    long countByRutaId(Long rutaId);

    @Query("SELECT s FROM SesionData s WHERE s.rutaId = :rutaId AND s.fecha = :fecha AND s.horaInicio <= :horaActual AND s.horaFin >= :horaActual")
    Optional<SesionData> findSesionActiva(
            @Param("rutaId") Long rutaId,
            @Param("fecha") LocalDate fecha,
            @Param("horaActual") LocalTime horaActual
    );
}