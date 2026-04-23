package com.gimnasio.transmoderno.alertas.infrastructure.mapper;

import com.gimnasio.transmoderno.alertas.domain.model.SolicitudAyuda;
import com.gimnasio.transmoderno.alertas.infrastructure.driver_adapters.jpa_repository.SolicitudAyudaData;
import org.springframework.stereotype.Component;

@Component
public class SolicitudAyudaMapper {

    public SolicitudAyuda toDomain(SolicitudAyudaData data) {
        return SolicitudAyuda.builder()
                .id(data.getId())
                .participanteId(data.getParticipanteId())
                .atendidaPor(data.getAtendidaPor())
                .fechaHora(data.getFechaHora())
                .atendida(data.getAtendida())
                .fechaAtencion(data.getFechaAtencion())
                .build();
    }

    public SolicitudAyudaData toData(SolicitudAyuda domain) {
        return SolicitudAyudaData.builder()
                .id(domain.getId())
                .participanteId(domain.getParticipanteId())
                .atendidaPor(domain.getAtendidaPor())
                .fechaHora(domain.getFechaHora())
                .atendida(domain.getAtendida())
                .fechaAtencion(domain.getFechaAtencion())
                .build();
    }
}