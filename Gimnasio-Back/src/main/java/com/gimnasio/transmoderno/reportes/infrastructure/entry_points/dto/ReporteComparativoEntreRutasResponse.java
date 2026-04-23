package com.gimnasio.transmoderno.reportes.infrastructure.entry_points.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ReporteComparativoEntreRutasResponse {
    private long totalRutas;
    private List<ReporteAsistenciaRutaResponse> asistenciaPorRuta;
    private List<ReporteComparativoRutaResponse> bienestarPorRuta;
    private String rutaMayorAsistencia;
    private String rutaMayorMejoraBienestar;
}
