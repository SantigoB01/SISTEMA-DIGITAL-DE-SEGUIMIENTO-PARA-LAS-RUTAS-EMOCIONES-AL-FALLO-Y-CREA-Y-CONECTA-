package com.gimnasio.transmoderno.reportes.infrastructure.entry_points.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReporteFichasResponse {
    private String pregunta;
    private Double promedioPre;
    private Double promedioPost;
}