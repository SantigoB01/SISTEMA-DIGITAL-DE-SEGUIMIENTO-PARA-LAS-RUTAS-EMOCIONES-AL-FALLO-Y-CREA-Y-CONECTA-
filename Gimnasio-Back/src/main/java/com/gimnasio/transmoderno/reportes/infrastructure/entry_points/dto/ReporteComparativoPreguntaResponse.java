package com.gimnasio.transmoderno.reportes.infrastructure.entry_points.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReporteComparativoPreguntaResponse {
    private Long preguntaId;
    private String textoPregunta;
    private Integer ordenPregunta;
    private double promedioPre;
    private double promedioPost;
    private double diferencia;
}
