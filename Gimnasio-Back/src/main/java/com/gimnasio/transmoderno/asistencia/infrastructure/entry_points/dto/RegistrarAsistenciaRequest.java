package com.gimnasio.transmoderno.asistencia.infrastructure.entry_points.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegistrarAsistenciaRequest {

    @NotBlank(message = "El número de identificación es obligatorio")
    private String numeroIdentificacion;

    @NotNull(message = "El id de la ruta es obligatorio")
    private Long rutaId;
}