package com.gimnasio.transmoderno.participantes.infrastructure.driver_adapters.jpa_repository;

import com.gimnasio.transmoderno.participantes.domain.model.EstudianteUcundinamarca;
import com.gimnasio.transmoderno.participantes.domain.model.port.EstudianteUcundinamarcaRepository;
import com.gimnasio.transmoderno.participantes.infrastructure.mapper.EstudianteUcundinamarcaMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class EstudianteUcundinamarcaRepositoryImpl
        implements EstudianteUcundinamarcaRepository {

    private final EstudianteUcundinamarcaJpaRepository jpaRepository;
    private final EstudianteUcundinamarcaMapper mapper;

    @Override
    public Optional<EstudianteUcundinamarca> findByDocumento(String documento) {
        return jpaRepository.findByDocumento(documento)
                .map(mapper::toDomain);
    }

    @Override
    public List<String> findProgramasUnicos() {
        return jpaRepository.findProgramasUnicos();
    }
}