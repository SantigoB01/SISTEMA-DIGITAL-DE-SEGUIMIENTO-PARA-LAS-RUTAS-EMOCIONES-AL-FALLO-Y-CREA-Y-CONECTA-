package com.gimnasio.transmoderno.sesiones.infrastructure.mapper;

import com.gimnasio.transmoderno.sesiones.domain.model.Sesion;
import com.gimnasio.transmoderno.sesiones.infrastructure.driver_adapters.jpa_repository.SesionData;
import org.springframework.stereotype.Component;

@Component
public class SesionMapper {

    public Sesion toDomain(SesionData data) {
        return Sesion.builder()
                .id(data.getId())
                .rutaId(data.getRutaId())
                .creadaPor(data.getCreadaPor())
                .nombre(data.getNombre())
                .fecha(data.getFecha())
                .horaInicio(data.getHoraInicio())
                .horaFin(data.getHoraFin())
                .build();
    }

    public SesionData toData(Sesion domain) {
        return SesionData.builder()
                .id(domain.getId())
                .rutaId(domain.getRutaId())
                .creadaPor(domain.getCreadaPor())
                .nombre(domain.getNombre())
                .fecha(domain.getFecha())
                .horaInicio(domain.getHoraInicio())
                .horaFin(domain.getHoraFin())
                .build();
    }
}