package com.gimnasio.transmoderno.fichas.infrastructure.driver_adapters.jpa_repository.ficha_pre;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FichaPreJpaRepository extends JpaRepository<FichaPreData, Long> {
    Optional<FichaPreData> findByInscripcionId(Long inscripcionId);
}