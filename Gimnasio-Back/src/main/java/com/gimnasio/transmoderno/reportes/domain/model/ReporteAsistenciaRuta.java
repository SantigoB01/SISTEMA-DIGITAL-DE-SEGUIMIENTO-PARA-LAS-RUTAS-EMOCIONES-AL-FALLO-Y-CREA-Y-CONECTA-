package com.gimnasio.transmoderno.reportes.domain.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReporteAsistenciaRuta {
    private Long rutaId;
    private String nombreRuta;
    private long totalSesiones;
    private long totalInscritos;
    private long totalRegistrosAsistencia;
    private double promedioAsistenciaPorSesion;
    private double porcentajeAsistenciaGeneral;
}
