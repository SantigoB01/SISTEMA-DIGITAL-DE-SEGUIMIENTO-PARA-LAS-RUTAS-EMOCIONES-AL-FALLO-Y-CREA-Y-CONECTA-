package com.gimnasio.transmoderno.fichas.infrastructure.entry_points.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class FichaPostResponse {
    private Long id;
    private Long fichaPreId;
    private LocalDateTime fechaDiligenciamiento;
    private Boolean completada;
    private List<RespuestaFichaResponse> respuestas;
}