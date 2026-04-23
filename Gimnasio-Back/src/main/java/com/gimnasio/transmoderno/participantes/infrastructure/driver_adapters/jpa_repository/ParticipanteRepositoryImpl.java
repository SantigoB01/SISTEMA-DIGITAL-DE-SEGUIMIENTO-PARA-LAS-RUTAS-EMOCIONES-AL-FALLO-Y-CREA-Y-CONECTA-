package com.gimnasio.transmoderno.participantes.infrastructure.driver_adapters.jpa_repository;

import com.gimnasio.transmoderno.participantes.domain.model.Participante;
import com.gimnasio.transmoderno.participantes.domain.model.port.ParticipanteRepository;
import com.gimnasio.transmoderno.participantes.infrastructure.mapper.ParticipanteMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class ParticipanteRepositoryImpl implements ParticipanteRepository {

    private final ParticipanteJpaRepository participanteJpaRepository;
    private final ParticipanteMapper participanteMapper;

    @Override
    public Participante save(Participante participante) {
        ParticipanteData data = participanteMapper.toData(participante);
        ParticipanteData saved = participanteJpaRepository.save(data);
        return participanteMapper.toDomain(saved);
    }

    @Override
    public Optional<Participante> findByNumeroIdentificacion(String numeroIdentificacion) {
        return participanteJpaRepository.findByNumeroIdentificacion(numeroIdentificacion)
                .map(participanteMapper::toDomain);
    }

    @Override
    public Optional<Participante> findById(Long id) {
        return participanteJpaRepository.findById(id)
                .map(participanteMapper::toDomain);
    }

    @Override
    public List<Participante> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return participanteJpaRepository.findAll(pageable)
                .getContent()
                .stream()
                .map(participanteMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public long count() {
        return participanteJpaRepository.count();
    }

    @Override
    public List<Participante> findByNombre(String nombre, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return participanteJpaRepository
                .findByNombreCompletoContainingIgnoreCase(nombre, pageable)
                .getContent()
                .stream()
                .map(participanteMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public long countByNombre(String nombre) {
        return participanteJpaRepository
                .countByNombreCompletoContainingIgnoreCase(nombre);
    }
}