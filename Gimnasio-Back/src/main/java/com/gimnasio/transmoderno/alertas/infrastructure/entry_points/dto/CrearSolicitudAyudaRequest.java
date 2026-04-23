package com.gimnasio.transmoderno.alertas.infrastructure.entry_points.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CrearSolicitudAyudaRequest {

    @NotBlank(message = "El número de identificación es obligatorio")
    private String numeroIdentificacion;
}