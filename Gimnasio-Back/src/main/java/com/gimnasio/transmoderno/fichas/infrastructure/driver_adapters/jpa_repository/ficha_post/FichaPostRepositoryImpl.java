package com.gimnasio.transmoderno.fichas.infrastructure.driver_adapters.jpa_repository;

import com.gimnasio.transmoderno.fichas.domain.model.FichaPost;
import com.gimnasio.transmoderno.fichas.domain.model.port.FichaPostRepository;
import com.gimnasio.transmoderno.fichas.infrastructure.driver_adapters.jpa_repository.ficha_post.FichaPostData;
import com.gimnasio.transmoderno.fichas.infrastructure.driver_adapters.jpa_repository.ficha_post.FichaPostJpaRepository;
import com.gimnasio.transmoderno.fichas.infrastructure.driver_adapters.jpa_repository.ficha_post.RespuestaFichaPostData;
import com.gimnasio.transmoderno.fichas.infrastructure.mapper.FichaPostMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class FichaPostRepositoryImpl implements FichaPostRepository {

    private final FichaPostJpaRepository fichaPostJpaRepository;
    private final FichaPostMapper fichaPostMapper;

    @Override
    public FichaPost save(FichaPost fichaPost) {
        FichaPostData data = FichaPostData.builder()
                .id(fichaPost.getId())
                .fichaPreId(fichaPost.getFichaPreId())
                .fechaDiligenciamiento(fichaPost.getFechaDiligenciamiento())
                .completada(fichaPost.getCompletada())
                .build();

        FichaPostData saved = fichaPostJpaRepository.save(data);

        if (fichaPost.getRespuestas() != null && !fichaPost.getRespuestas().isEmpty()) {
            List<RespuestaFichaPostData> respuestas = fichaPost.getRespuestas().stream()
                    .map(r -> RespuestaFichaPostData.builder()
                            .fichaPostId(saved.getId())
                            .preguntaId(r.getPreguntaId())
                            .valor(r.getValor())
                            .build())
                    .collect(Collectors.toList());
            saved.setRespuestas(respuestas);
            fichaPostJpaRepository.save(saved);
        }

        return fichaPostMapper.toDomain(fichaPostJpaRepository.findById(saved.getId()).get());
    }

    @Override
    public Optional<FichaPost> findByFichaPreId(Long fichaPreId) {
        return fichaPostJpaRepository.findByFichaPreId(fichaPreId)
                .map(fichaPostMapper::toDomain);
    }

    @Override
    public Optional<FichaPost> findById(Long id) {
        return fichaPostJpaRepository.findById(id)
                .map(fichaPostMapper::toDomain);
    }
}