package com.gimnasio.transmoderno.fichas.infrastructure.entry_points.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CrearFichaPreRequest {

    @NotNull(message = "El id de la inscripción es obligatorio")
    private Long inscripcionId;

    @NotEmpty(message = "Las respuestas son obligatorias")
    private List<RespuestaFichaRequest> respuestas;
}