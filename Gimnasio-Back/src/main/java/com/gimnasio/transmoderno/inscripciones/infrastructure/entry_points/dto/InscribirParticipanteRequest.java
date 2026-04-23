package com.gimnasio.transmoderno.inscripciones.infrastructure.entry_points.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InscribirParticipanteRequest {

    @NotBlank(message = "El número de identificación es obligatorio")
    private String numeroIdentificacion;

    @NotNull(message = "El id de la ruta es obligatorio")
    private Long rutaId;
}