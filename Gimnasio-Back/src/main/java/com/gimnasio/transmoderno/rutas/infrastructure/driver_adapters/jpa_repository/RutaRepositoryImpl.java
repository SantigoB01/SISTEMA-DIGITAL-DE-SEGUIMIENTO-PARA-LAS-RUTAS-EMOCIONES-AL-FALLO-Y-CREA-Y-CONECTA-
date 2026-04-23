package com.gimnasio.transmoderno.rutas.infrastructure.driver_adapters.jpa_repository;

import com.gimnasio.transmoderno.rutas.domain.model.Ruta;
import com.gimnasio.transmoderno.rutas.domain.model.port.RutaRepository;
import com.gimnasio.transmoderno.rutas.infrastructure.mapper.RutaMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class RutaRepositoryImpl implements RutaRepository {

    private final RutaJpaRepository rutaJpaRepository;
    private final RutaMapper rutaMapper;

    @Override
    public Ruta save(Ruta ruta) {
        RutaData data = rutaMapper.toData(ruta);
        RutaData saved = rutaJpaRepository.save(data);
        return rutaMapper.toDomain(saved);
    }

    @Override
    public Optional<Ruta> findById(Long id) {
        return rutaJpaRepository.findById(id)
                .map(rutaMapper::toDomain);
    }

    @Override
    public Optional<Ruta> findByNombre(String nombre) {
        return rutaJpaRepository.findByNombre(nombre)
                .map(rutaMapper::toDomain);
    }

    @Override
    public List<Ruta> findAll() {
        return rutaJpaRepository.findAll()
                .stream()
                .map(rutaMapper::toDomain)
                .collect(Collectors.toList());
    }
}