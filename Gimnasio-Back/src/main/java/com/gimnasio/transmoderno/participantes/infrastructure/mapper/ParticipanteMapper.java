package com.gimnasio.transmoderno.participantes.infrastructure.mapper;

import com.gimnasio.transmoderno.participantes.domain.model.Participante;
import com.gimnasio.transmoderno.participantes.infrastructure.driver_adapters.jpa_repository.ParticipanteData;
import org.springframework.stereotype.Component;

@Component
public class ParticipanteMapper {

    public Participante toDomain(ParticipanteData data) {
        return Participante.builder()
                .id(data.getId())
                .numeroIdentificacion(data.getNumeroIdentificacion())
                .nombreCompleto(data.getNombreCompleto())
                .correoInstitucional(data.getCorreoInstitucional())
                .programaAcademico(data.getProgramaAcademico())
                .semestre(data.getSemestre())
                .fechaRegistro(data.getFechaRegistro())
                .activo(data.getActivo())
                .tipoDocumento(data.getTipoDocumento())
                .sede(data.getSede())
                .telefono(data.getTelefono())
                .estamento(data.getEstamento())
                .build();
    }

    public ParticipanteData toData(Participante domain) {
        return ParticipanteData.builder()
                .id(domain.getId())
                .numeroIdentificacion(domain.getNumeroIdentificacion())
                .nombreCompleto(domain.getNombreCompleto())
                .correoInstitucional(domain.getCorreoInstitucional())
                .programaAcademico(domain.getProgramaAcademico())
                .semestre(domain.getSemestre())
                .fechaRegistro(domain.getFechaRegistro())
                .activo(domain.getActivo())
                .tipoDocumento(domain.getTipoDocumento())
                .sede(domain.getSede())
                .telefono(domain.getTelefono())
                .estamento(domain.getEstamento())
                .build();
    }
}