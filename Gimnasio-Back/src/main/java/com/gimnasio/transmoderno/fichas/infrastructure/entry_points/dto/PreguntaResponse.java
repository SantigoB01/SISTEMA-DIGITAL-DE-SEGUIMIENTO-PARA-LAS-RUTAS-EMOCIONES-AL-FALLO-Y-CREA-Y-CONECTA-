package com.gimnasio.transmoderno.fichas.infrastructure.entry_points.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PreguntaResponse {
    private Long id;
    private Long rutaId;
    private String texto;
    private Integer orden;
    private Boolean activa;
}