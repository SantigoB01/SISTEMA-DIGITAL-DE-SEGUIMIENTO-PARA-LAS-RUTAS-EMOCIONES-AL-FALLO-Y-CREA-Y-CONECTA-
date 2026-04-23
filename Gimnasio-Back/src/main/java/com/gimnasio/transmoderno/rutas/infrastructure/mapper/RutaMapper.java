package com.gimnasio.transmoderno.rutas.infrastructure.mapper;

import com.gimnasio.transmoderno.rutas.domain.model.Ruta;
import com.gimnasio.transmoderno.rutas.infrastructure.driver_adapters.jpa_repository.RutaData;
import org.springframework.stereotype.Component;

@Component
public class RutaMapper {

    public Ruta toDomain(RutaData data) {
        return Ruta.builder()
                .id(data.getId())
                .nombre(data.getNombre())
                .descripcion(data.getDescripcion())
                .activa(data.getActiva())
                .build();
    }

    public RutaData toData(Ruta domain) {
        return RutaData.builder()
                .id(domain.getId())
                .nombre(domain.getNombre())
                .descripcion(domain.getDescripcion())
                .activa(domain.getActiva())
                .build();
    }
}