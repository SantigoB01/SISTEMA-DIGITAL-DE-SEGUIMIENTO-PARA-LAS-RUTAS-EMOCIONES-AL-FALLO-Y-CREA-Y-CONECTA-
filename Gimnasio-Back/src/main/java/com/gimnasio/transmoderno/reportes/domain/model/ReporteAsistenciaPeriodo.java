package com.gimnasio.transmoderno.reportes.domain.model;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReporteAsistenciaPeriodo {
    private Long rutaId;
    private String nombreRuta;
    private LocalDate desde;
    private LocalDate hasta;
    private long totalSesionesEnPeriodo;
    private long totalInscritos;
    private long totalRegistrosAsistencia;
    private double promedioAsistenciaPorSesion;
    private double porcentajeAsistenciaGeneral;
    private List<ReporteAsistenciaSesion> detallePorSesion;
}
