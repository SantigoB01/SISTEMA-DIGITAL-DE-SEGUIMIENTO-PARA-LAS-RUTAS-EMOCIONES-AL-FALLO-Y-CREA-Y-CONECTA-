package com.gimnasio.transmoderno.fichas.infrastructure.entry_points.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActualizarPreguntaRequest {

    @NotBlank(message = "El texto de la pregunta es obligatorio")
    private String texto;

    @NotNull(message = "El orden es obligatorio")
    private Integer orden;
}