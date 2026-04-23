package com.gimnasio.transmoderno.reportes.infrastructure.entry_points.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReporteAsistenciaRutaResponse {
    private Long rutaId;
    private String nombreRuta;
    private long totalSesiones;
    private long totalInscritos;
    private long totalRegistrosAsistencia;
    private double promedioAsistenciaPorSesion;
    private double porcentajeAsistenciaGeneral;
}
