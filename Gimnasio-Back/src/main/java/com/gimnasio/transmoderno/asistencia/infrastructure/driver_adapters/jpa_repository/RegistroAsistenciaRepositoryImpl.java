package com.gimnasio.transmoderno.asistencia.infrastructure.driver_adapters.jpa_repository;

import com.gimnasio.transmoderno.asistencia.domain.model.RegistroAsistencia;
import com.gimnasio.transmoderno.asistencia.domain.model.port.RegistroAsistenciaRepository;
import com.gimnasio.transmoderno.asistencia.infrastructure.mapper.RegistroAsistenciaMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class RegistroAsistenciaRepositoryImpl implements RegistroAsistenciaRepository {

    private final RegistroAsistenciaJpaRepository registroAsistenciaJpaRepository;
    private final RegistroAsistenciaMapper registroAsistenciaMapper;

    @Override
    public RegistroAsistencia save(RegistroAsistencia registro) {
        RegistroAsistenciaData data = registroAsistenciaMapper.toData(registro);
        RegistroAsistenciaData saved = registroAsistenciaJpaRepository.save(data);
        return registroAsistenciaMapper.toDomain(saved);
    }

    @Override
    public Optional<RegistroAsistencia> findByParticipanteIdAndSesionId(
            Long participanteId, Long sesionId) {
        return registroAsistenciaJpaRepository
                .findByParticipanteIdAndSesionId(participanteId, sesionId)
                .map(registroAsistenciaMapper::toDomain);
    }

    @Override
    public List<RegistroAsistencia> findBySesionId(Long sesionId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return registroAsistenciaJpaRepository.findBySesionId(sesionId, pageable)
                .getContent()
                .stream()
                .map(registroAsistenciaMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public long countBySesionId(Long sesionId) {
        return registroAsistenciaJpaRepository.countBySesionId(sesionId);
    }

    @Override
    public List<RegistroAsistencia> findByParticipanteId(Long participanteId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return registroAsistenciaJpaRepository.findByParticipanteId(participanteId, pageable)
                .getContent()
                .stream()
                .map(registroAsistenciaMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public long countByParticipanteId(Long participanteId) {
        return registroAsistenciaJpaRepository.countByParticipanteId(participanteId);
    }
}