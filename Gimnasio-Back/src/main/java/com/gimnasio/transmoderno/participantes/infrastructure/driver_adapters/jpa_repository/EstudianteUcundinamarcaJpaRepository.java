package com.gimnasio.transmoderno.participantes.infrastructure.driver_adapters.jpa_repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EstudianteUcundinamarcaJpaRepository
        extends JpaRepository<EstudianteUcundinamarcaData, String> {

    Optional<EstudianteUcundinamarcaData> findByDocumento(String documento);

    @Query("SELECT DISTINCT e.pensum FROM EstudianteUcundinamarcaData e WHERE e.pensum IS NOT NULL ORDER BY e.pensum")
    List<String> findProgramasUnicos();
}