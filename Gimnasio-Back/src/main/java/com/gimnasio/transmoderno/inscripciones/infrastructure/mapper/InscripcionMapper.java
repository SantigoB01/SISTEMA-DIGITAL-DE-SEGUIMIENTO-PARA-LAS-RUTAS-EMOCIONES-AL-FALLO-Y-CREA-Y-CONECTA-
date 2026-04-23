package com.gimnasio.transmoderno.inscripciones.infrastructure.mapper;

import com.gimnasio.transmoderno.inscripciones.domain.model.Inscripcion;
import com.gimnasio.transmoderno.inscripciones.infrastructure.driver_adapters.jpa_repository.InscripcionData;
import org.springframework.stereotype.Component;

@Component
public class InscripcionMapper {

    public Inscripcion toDomain(InscripcionData data) {
        return Inscripcion.builder()
                .id(data.getId())
                .participanteId(data.getParticipanteId())
                .rutaId(data.getRutaId())
                .fechaInscripcion(data.getFechaInscripcion())
                .estado(data.getEstado())
                .build();
    }

    public InscripcionData toData(Inscripcion domain) {
        return InscripcionData.builder()
                .id(domain.getId())
                .participanteId(domain.getParticipanteId())
                .rutaId(domain.getRutaId())
                .fechaInscripcion(domain.getFechaInscripcion())
                .estado(domain.getEstado())
                .build();
    }
}