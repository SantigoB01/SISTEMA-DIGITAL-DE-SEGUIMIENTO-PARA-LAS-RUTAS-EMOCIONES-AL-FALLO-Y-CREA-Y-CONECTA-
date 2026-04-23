package com.gimnasio.transmoderno.fichas.infrastructure.entry_points.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RespuestaFichaRequest {

    @NotNull(message = "El id de la pregunta es obligatorio")
    private Long preguntaId;

    @NotNull(message = "El valor es obligatorio")
    @Min(value = 1, message = "El valor mínimo es 1")
    @Max(value = 5, message = "El valor máximo es 5")
    private Integer valor;
}