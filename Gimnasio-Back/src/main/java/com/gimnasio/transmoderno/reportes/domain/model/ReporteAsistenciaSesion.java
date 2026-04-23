package com.gimnasio.transmoderno.reportes.domain.model;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReporteAsistenciaSesion {
    private Long sesionId;
    private String nombreSesion;
    private LocalDate fecha;
    private Long rutaId;
    private String nombreRuta;
    private long totalAsistentes;
    private long totalInscritos;
    private double porcentajeAsistencia;
}
