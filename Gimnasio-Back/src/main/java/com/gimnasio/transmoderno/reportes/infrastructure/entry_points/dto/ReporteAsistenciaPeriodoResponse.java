package com.gimnasio.transmoderno.reportes.infrastructure.entry_points.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@AllArgsConstructor
public class ReporteAsistenciaPeriodoResponse {
    private Long rutaId;
    private String nombreRuta;
    private LocalDate desde;
    private LocalDate hasta;
    private long totalSesionesEnPeriodo;
    private long totalInscritos;
    private long totalRegistrosAsistencia;
    private double promedioAsistenciaPorSesion;
    private double porcentajeAsistenciaGeneral;
    private List<ReporteAsistenciaSesionResponse> detallePorSesion;
}
