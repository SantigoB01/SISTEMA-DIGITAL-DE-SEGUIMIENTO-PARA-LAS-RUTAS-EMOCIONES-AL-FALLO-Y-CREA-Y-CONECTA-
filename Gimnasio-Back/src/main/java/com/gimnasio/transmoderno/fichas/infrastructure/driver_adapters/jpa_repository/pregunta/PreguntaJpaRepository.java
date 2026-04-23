package com.gimnasio.transmoderno.fichas.infrastructure.driver_adapters.jpa_repository.pregunta;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PreguntaJpaRepository extends JpaRepository<PreguntaData, Long> {
    List<PreguntaData> findByRutaId(Long rutaId);
    List<PreguntaData> findByRutaIdAndActivaTrue(Long rutaId);
}