package com.gimnasio.transmoderno.sesiones.infrastructure.driver_adapters.jpa_repository;

import com.gimnasio.transmoderno.sesiones.domain.model.Sesion;
import com.gimnasio.transmoderno.sesiones.domain.model.port.SesionRepository;
import com.gimnasio.transmoderno.sesiones.infrastructure.mapper.SesionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class SesionRepositoryImpl implements SesionRepository {

    private final SesionJpaRepository sesionJpaRepository;
    private final SesionMapper sesionMapper;

    @Override
    public Sesion save(Sesion sesion) {
        SesionData data = sesionMapper.toData(sesion);
        SesionData saved = sesionJpaRepository.save(data);
        return sesionMapper.toDomain(saved);
    }

    @Override
    public Optional<Sesion> findById(Long id) {
        return sesionJpaRepository.findById(id)
                .map(sesionMapper::toDomain);
    }

    @Override
    public List<Sesion> findByRutaId(Long rutaId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return sesionJpaRepository.findByRutaId(rutaId, pageable)
                .getContent()
                .stream()
                .map(sesionMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public long countByRutaId(Long rutaId) {
        return sesionJpaRepository.countByRutaId(rutaId);
    }

    @Override
    public Optional<Sesion> findSesionActiva(Long rutaId, LocalDate fecha, LocalTime horaActual) {
        return sesionJpaRepository.findSesionActiva(rutaId, fecha, horaActual)
                .map(sesionMapper::toDomain);
    }

    @Override
    public void deleteById(Long id) {
        sesionJpaRepository.deleteById(id);
    }
}