package com.gimnasio.transmoderno.reportes.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReporteRetencion {
    private String ruta;
    private long totalInscritos;
    private long activos;
    private long inactivos;
    private double tasaRetencion;
}