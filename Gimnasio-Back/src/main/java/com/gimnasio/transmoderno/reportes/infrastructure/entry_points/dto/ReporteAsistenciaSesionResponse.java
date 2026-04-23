package com.gimnasio.transmoderno.reportes.infrastructure.entry_points.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class ReporteAsistenciaSesionResponse {
    private Long sesionId;
    private String nombreSesion;
    private LocalDate fecha;
    private Long rutaId;
    private String nombreRuta;
    private long totalAsistentes;
    private long totalInscritos;
    private double porcentajeAsistencia;
}
