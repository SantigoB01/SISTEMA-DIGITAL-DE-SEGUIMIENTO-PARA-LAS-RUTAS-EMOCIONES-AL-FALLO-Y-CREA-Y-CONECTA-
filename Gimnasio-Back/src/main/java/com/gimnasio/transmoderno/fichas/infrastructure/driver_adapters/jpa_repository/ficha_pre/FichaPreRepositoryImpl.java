package com.gimnasio.transmoderno.fichas.infrastructure.driver_adapters.jpa_repository;

import com.gimnasio.transmoderno.fichas.domain.model.FichaPre;
import com.gimnasio.transmoderno.fichas.domain.model.port.FichaPreRepository;
import com.gimnasio.transmoderno.fichas.infrastructure.driver_adapters.jpa_repository.ficha_pre.FichaPreData;
import com.gimnasio.transmoderno.fichas.infrastructure.driver_adapters.jpa_repository.ficha_pre.FichaPreJpaRepository;
import com.gimnasio.transmoderno.fichas.infrastructure.driver_adapters.jpa_repository.ficha_pre.RespuestaFichaPreData;
import com.gimnasio.transmoderno.fichas.infrastructure.mapper.FichaPreMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class FichaPreRepositoryImpl implements FichaPreRepository {

    private final FichaPreJpaRepository fichaPreJpaRepository;
    private final FichaPreMapper fichaPreMapper;

    @Override
    public FichaPre save(FichaPre fichaPre) {
        FichaPreData data = FichaPreData.builder()
                .id(fichaPre.getId())
                .inscripcionId(fichaPre.getInscripcionId())
                .fechaDiligenciamiento(fichaPre.getFechaDiligenciamiento())
                .completada(fichaPre.getCompletada())
                .build();

        FichaPreData saved = fichaPreJpaRepository.save(data);

        if (fichaPre.getRespuestas() != null && !fichaPre.getRespuestas().isEmpty()) {
            List<RespuestaFichaPreData> respuestas = fichaPre.getRespuestas().stream()
                    .map(r -> RespuestaFichaPreData.builder()
                            .fichaPreId(saved.getId())
                            .preguntaId(r.getPreguntaId())
                            .valor(r.getValor())
                            .build())
                    .collect(Collectors.toList());
            saved.setRespuestas(respuestas);
            fichaPreJpaRepository.save(saved);
        }

        return fichaPreMapper.toDomain(fichaPreJpaRepository.findById(saved.getId()).get());
    }

    @Override
    public Optional<FichaPre> findByInscripcionId(Long inscripcionId) {
        return fichaPreJpaRepository.findByInscripcionId(inscripcionId)
                .map(fichaPreMapper::toDomain);
    }

    @Override
    public Optional<FichaPre> findById(Long id) {
        return fichaPreJpaRepository.findById(id)
                .map(fichaPreMapper::toDomain);
    }
}