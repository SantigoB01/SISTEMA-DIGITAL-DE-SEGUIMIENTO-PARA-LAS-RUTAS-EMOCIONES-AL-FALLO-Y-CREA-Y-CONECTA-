package com.gimnasio.transmoderno.alertas.infrastructure.driver_adapters.jpa_repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SolicitudAyudaJpaRepository extends JpaRepository<SolicitudAyudaData, Long> {
    Page<SolicitudAyudaData> findAll(Pageable pageable);
}