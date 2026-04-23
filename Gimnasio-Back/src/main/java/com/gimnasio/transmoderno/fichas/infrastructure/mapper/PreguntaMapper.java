package com.gimnasio.transmoderno.fichas.infrastructure.mapper;

import com.gimnasio.transmoderno.fichas.domain.model.Pregunta;
import com.gimnasio.transmoderno.fichas.infrastructure.driver_adapters.jpa_repository.pregunta.PreguntaData;
import org.springframework.stereotype.Component;

@Component
public class PreguntaMapper {

    public Pregunta toDomain(PreguntaData data) {
        return Pregunta.builder()
                .id(data.getId())
                .rutaId(data.getRutaId())
                .texto(data.getTexto())
                .orden(data.getOrden())
                .activa(data.getActiva())
                .build();
    }

    public PreguntaData toData(Pregunta domain) {
        return PreguntaData.builder()
                .id(domain.getId())
                .rutaId(domain.getRutaId())
                .texto(domain.getTexto())
                .orden(domain.getOrden())
                .activa(domain.getActiva())
                .build();
    }
}