package com.gimnasio.transmoderno.rutas.infrastructure.driver_adapters.jpa_repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RutaJpaRepository extends JpaRepository<RutaData, Long> {
    Optional<RutaData> findByNombre(String nombre);
}