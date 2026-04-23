package com.gimnasio.transmoderno.asistencia.infrastructure.mapper;

import com.gimnasio.transmoderno.asistencia.domain.model.RegistroAsistencia;
import com.gimnasio.transmoderno.asistencia.infrastructure.driver_adapters.jpa_repository.RegistroAsistenciaData;
import org.springframework.stereotype.Component;

@Component
public class RegistroAsistenciaMapper {

    public RegistroAsistencia toDomain(RegistroAsistenciaData data) {
        return RegistroAsistencia.builder()
                .id(data.getId())
                .participanteId(data.getParticipanteId())
                .sesionId(data.getSesionId())
                .fechaHoraRegistro(data.getFechaHoraRegistro())
                .build();
    }

    public RegistroAsistenciaData toData(RegistroAsistencia domain) {
        return RegistroAsistenciaData.builder()
                .id(domain.getId())
                .participanteId(domain.getParticipanteId())
                .sesionId(domain.getSesionId())
                .fechaHoraRegistro(domain.getFechaHoraRegistro())
                .build();
    }
}