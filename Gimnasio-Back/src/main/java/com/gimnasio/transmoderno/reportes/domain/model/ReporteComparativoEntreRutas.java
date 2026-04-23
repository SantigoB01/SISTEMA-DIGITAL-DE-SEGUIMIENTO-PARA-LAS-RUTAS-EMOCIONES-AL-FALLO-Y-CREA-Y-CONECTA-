package com.gimnasio.transmoderno.reportes.domain.model;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReporteComparativoEntreRutas {
    private long totalRutas;
    private List<ReporteAsistenciaRuta> asistenciaPorRuta;
    private List<ReporteComparativoRuta> bienestarPorRuta;
    private String rutaMayorAsistencia;
    private String rutaMayorMejoraBienestar;
}
