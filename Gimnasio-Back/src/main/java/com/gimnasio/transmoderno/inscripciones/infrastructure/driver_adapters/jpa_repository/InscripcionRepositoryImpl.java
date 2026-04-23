package com.gimnasio.transmoderno.inscripciones.infrastructure.driver_adapters.jpa_repository;

import com.gimnasio.transmoderno.inscripciones.domain.model.EstadoInscripcion;
import com.gimnasio.transmoderno.inscripciones.domain.model.Inscripcion;
import com.gimnasio.transmoderno.inscripciones.domain.model.port.InscripcionRepository;
import com.gimnasio.transmoderno.inscripciones.infrastructure.mapper.InscripcionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class InscripcionRepositoryImpl implements InscripcionRepository {

    private final InscripcionJpaRepository inscripcionJpaRepository;
    private final InscripcionMapper inscripcionMapper;

    @Override
    public Inscripcion save(Inscripcion inscripcion) {
        InscripcionData data = inscripcionMapper.toData(inscripcion);
        InscripcionData saved = inscripcionJpaRepository.save(data);
        return inscripcionMapper.toDomain(saved);
    }

    @Override
    public Optional<Inscripcion> findById(Long id) {
        return inscripcionJpaRepository.findById(id)
                .map(inscripcionMapper::toDomain);
    }

    @Override
    public List<Inscripcion> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return inscripcionJpaRepository.findAll(pageable)
                .getContent()
                .stream()
                .map(inscripcionMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public long count() {
        return inscripcionJpaRepository.count();
    }

    @Override
    public List<Inscripcion> findByParticipanteId(Long participanteId) {
        return inscripcionJpaRepository.findByParticipanteId(participanteId)
                .stream()
                .map(inscripcionMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Inscripcion> findByParticipanteIdAndRutaId(Long participanteId, Long rutaId) {
        return inscripcionJpaRepository.findByParticipanteIdAndRutaId(participanteId, rutaId)
                .map(inscripcionMapper::toDomain);
    }

    @Override
    public long countByRutaId(Long rutaId) {
        return inscripcionJpaRepository.countByRutaId(rutaId);
    }

    @Override
    public long countByRutaIdAndEstado(Long rutaId, EstadoInscripcion estado) {
        return inscripcionJpaRepository.countByRutaIdAndEstado(rutaId, estado);
    }
}