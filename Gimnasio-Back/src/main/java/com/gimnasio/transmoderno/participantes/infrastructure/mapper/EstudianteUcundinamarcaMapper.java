package com.gimnasio.transmoderno.participantes.infrastructure.mapper;

import com.gimnasio.transmoderno.participantes.domain.model.EstudianteUcundinamarca;
import com.gimnasio.transmoderno.participantes.infrastructure.driver_adapters.jpa_repository.EstudianteUcundinamarcaData;
import org.springframework.stereotype.Component;

@Component
public class EstudianteUcundinamarcaMapper {

    public EstudianteUcundinamarca toDomain(EstudianteUcundinamarcaData data) {
        return EstudianteUcundinamarca.builder()
                .documento(data.getDocumento())
                .tipoDocumento(data.getTipoDocumento())
                .primerApellido(data.getPrimerApellido())
                .segundoApellido(data.getSegundoApellido())
                .primerNombre(data.getPrimerNombre())
                .segundoNombre(data.getSegundoNombre())
                .nombreCompleto(data.getNombreCompleto())
                .modalidad(data.getModalidad())
                .correoInstitucional(data.getCorreoInstitucional())
                .sede(data.getSede())
                .pensum(data.getPensum())
                .build();
    }
}