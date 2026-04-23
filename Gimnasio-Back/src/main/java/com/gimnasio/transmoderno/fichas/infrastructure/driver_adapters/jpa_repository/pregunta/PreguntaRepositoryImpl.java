package com.gimnasio.transmoderno.fichas.infrastructure.driver_adapters.jpa_repository.pregunta;

import com.gimnasio.transmoderno.fichas.domain.model.Pregunta;
import com.gimnasio.transmoderno.fichas.domain.model.port.PreguntaRepository;
import com.gimnasio.transmoderno.fichas.infrastructure.mapper.PreguntaMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class PreguntaRepositoryImpl implements PreguntaRepository {

    private final PreguntaJpaRepository preguntaJpaRepository;
    private final PreguntaMapper preguntaMapper;

    @Override
    public Pregunta save(Pregunta pregunta) {
        PreguntaData data = preguntaMapper.toData(pregunta);
        PreguntaData saved = preguntaJpaRepository.save(data);
        return preguntaMapper.toDomain(saved);
    }

    @Override
    public Optional<Pregunta> findById(Long id) {
        return preguntaJpaRepository.findById(id)
                .map(preguntaMapper::toDomain);
    }

    @Override
    public List<Pregunta> findByRutaId(Long rutaId) {
        return preguntaJpaRepository.findByRutaId(rutaId)
                .stream()
                .map(preguntaMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Pregunta> findByRutaIdAndActivaTrue(Long rutaId) {
        return preguntaJpaRepository.findByRutaIdAndActivaTrue(rutaId)
                .stream()
                .map(preguntaMapper::toDomain)
                .collect(Collectors.toList());
    }
}