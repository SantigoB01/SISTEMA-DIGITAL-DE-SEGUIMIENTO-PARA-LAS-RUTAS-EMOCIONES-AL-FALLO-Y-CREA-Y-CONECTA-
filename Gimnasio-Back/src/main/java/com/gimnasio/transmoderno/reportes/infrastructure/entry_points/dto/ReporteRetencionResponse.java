package com.gimnasio.transmoderno.reportes.infrastructure.entry_points.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReporteRetencionResponse {
    private String ruta;
    private long totalInscritos;
    private long activos;
    private long inactivos;
    private double tasaRetencion;
}