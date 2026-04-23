package com.gimnasio.transmoderno.fichas.infrastructure.mapper;

import com.gimnasio.transmoderno.fichas.domain.model.FichaPost;
import com.gimnasio.transmoderno.fichas.domain.model.RespuestaFicha;
import com.gimnasio.transmoderno.fichas.infrastructure.driver_adapters.jpa_repository.ficha_post.FichaPostData;
import com.gimnasio.transmoderno.fichas.infrastructure.driver_adapters.jpa_repository.ficha_post.RespuestaFichaPostData;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class FichaPostMapper {

    public FichaPost toDomain(FichaPostData data) {
        List<RespuestaFicha> respuestas = data.getRespuestas() == null
                ? Collections.emptyList()
                : data.getRespuestas().stream()
                .map(r -> RespuestaFicha.builder()
                        .id(r.getId())
                        .preguntaId(r.getPreguntaId())
                        .valor(r.getValor())
                        .build())
                .collect(Collectors.toList());

        return FichaPost.builder()
                .id(data.getId())
                .fichaPreId(data.getFichaPreId())
                .fechaDiligenciamiento(data.getFechaDiligenciamiento())
                .completada(data.getCompletada())
                .respuestas(respuestas)
                .build();
    }

    public FichaPostData toData(FichaPost domain) {
        FichaPostData data = FichaPostData.builder()
                .id(domain.getId())
                .fichaPreId(domain.getFichaPreId())
                .fechaDiligenciamiento(domain.getFechaDiligenciamiento())
                .completada(domain.getCompletada())
                .build();

        if (domain.getRespuestas() != null) {
            List<RespuestaFichaPostData> respuestas = domain.getRespuestas().stream()
                    .map(r -> RespuestaFichaPostData.builder()
                            .fichaPostId(domain.getId())
                            .preguntaId(r.getPreguntaId())
                            .valor(r.getValor())
                            .build())
                    .collect(Collectors.toList());
            data.setRespuestas(respuestas);
        }

        return data;
    }
}