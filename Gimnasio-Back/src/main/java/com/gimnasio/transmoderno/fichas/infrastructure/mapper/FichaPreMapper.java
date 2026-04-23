package com.gimnasio.transmoderno.fichas.infrastructure.mapper;

import com.gimnasio.transmoderno.fichas.domain.model.FichaPre;
import com.gimnasio.transmoderno.fichas.domain.model.RespuestaFicha;
import com.gimnasio.transmoderno.fichas.infrastructure.driver_adapters.jpa_repository.ficha_pre.FichaPreData;
import com.gimnasio.transmoderno.fichas.infrastructure.driver_adapters.jpa_repository.ficha_pre.RespuestaFichaPreData;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class FichaPreMapper {

    public FichaPre toDomain(FichaPreData data) {
        List<RespuestaFicha> respuestas = data.getRespuestas() == null
                ? Collections.emptyList()
                : data.getRespuestas().stream()
                .map(r -> RespuestaFicha.builder()
                        .id(r.getId())
                        .preguntaId(r.getPreguntaId())
                        .valor(r.getValor())
                        .build())
                .collect(Collectors.toList());

        return FichaPre.builder()
                .id(data.getId())
                .inscripcionId(data.getInscripcionId())
                .fechaDiligenciamiento(data.getFechaDiligenciamiento())
                .completada(data.getCompletada())
                .respuestas(respuestas)
                .build();
    }

    public FichaPreData toData(FichaPre domain) {
        FichaPreData data = FichaPreData.builder()
                .id(domain.getId())
                .inscripcionId(domain.getInscripcionId())
                .fechaDiligenciamiento(domain.getFechaDiligenciamiento())
                .completada(domain.getCompletada())
                .build();

        if (domain.getRespuestas() != null) {
            List<RespuestaFichaPreData> respuestas = domain.getRespuestas().stream()
                    .map(r -> RespuestaFichaPreData.builder()
                            .fichaPreId(domain.getId())
                            .preguntaId(r.getPreguntaId())
                            .valor(r.getValor())
                            .build())
                    .collect(Collectors.toList());
            data.setRespuestas(respuestas);
        }

        return data;
    }
}