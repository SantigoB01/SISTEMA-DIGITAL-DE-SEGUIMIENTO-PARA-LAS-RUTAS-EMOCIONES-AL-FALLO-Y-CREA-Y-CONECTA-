package com.gimnasio.transmoderno.fichas.infrastructure.driver_adapters.jpa_repository.ficha_post;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FichaPostJpaRepository extends JpaRepository<FichaPostData, Long> {
    Optional<FichaPostData> findByFichaPreId(Long fichaPreId);
}