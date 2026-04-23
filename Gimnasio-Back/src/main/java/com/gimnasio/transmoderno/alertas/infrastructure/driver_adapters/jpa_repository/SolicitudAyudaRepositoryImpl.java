package com.gimnasio.transmoderno.alertas.infrastructure.driver_adapters.jpa_repository;

import com.gimnasio.transmoderno.alertas.domain.model.SolicitudAyuda;
import com.gimnasio.transmoderno.alertas.domain.model.port.SolicitudAyudaRepository;
import com.gimnasio.transmoderno.alertas.infrastructure.mapper.SolicitudAyudaMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class SolicitudAyudaRepositoryImpl implements SolicitudAyudaRepository {

    private final SolicitudAyudaJpaRepository solicitudAyudaJpaRepository;
    private final SolicitudAyudaMapper solicitudAyudaMapper;

    @Override
    public SolicitudAyuda save(SolicitudAyuda solicitudAyuda) {
        SolicitudAyudaData data = solicitudAyudaMapper.toData(solicitudAyuda);
        SolicitudAyudaData saved = solicitudAyudaJpaRepository.save(data);
        return solicitudAyudaMapper.toDomain(saved);
    }

    @Override
    public Optional<SolicitudAyuda> findById(Long id) {
        return solicitudAyudaJpaRepository.findById(id)
                .map(solicitudAyudaMapper::toDomain);
    }

    @Override
    public List<SolicitudAyuda> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return solicitudAyudaJpaRepository.findAll(pageable)
                .getContent()
                .stream()
                .map(solicitudAyudaMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public long count() {
        return solicitudAyudaJpaRepository.count();
    }
}