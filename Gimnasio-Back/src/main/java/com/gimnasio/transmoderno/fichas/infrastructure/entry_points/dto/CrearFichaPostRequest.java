package com.gimnasio.transmoderno.fichas.infrastructure.entry_points.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CrearFichaPostRequest {

    @NotNull(message = "El id de la ficha PRE es obligatorio")
    private Long fichaPreId;

    @NotEmpty(message = "Las respuestas son obligatorias")
    private List<RespuestaFichaRequest> respuestas;
}