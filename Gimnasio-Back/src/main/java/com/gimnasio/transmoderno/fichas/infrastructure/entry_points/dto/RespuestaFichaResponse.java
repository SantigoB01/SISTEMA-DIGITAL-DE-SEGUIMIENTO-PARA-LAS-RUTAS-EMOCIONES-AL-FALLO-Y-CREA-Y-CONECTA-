package com.gimnasio.transmoderno.fichas.infrastructure.entry_points.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RespuestaFichaResponse {
    private Long id;
    private Long preguntaId;
    private Integer valor;
}