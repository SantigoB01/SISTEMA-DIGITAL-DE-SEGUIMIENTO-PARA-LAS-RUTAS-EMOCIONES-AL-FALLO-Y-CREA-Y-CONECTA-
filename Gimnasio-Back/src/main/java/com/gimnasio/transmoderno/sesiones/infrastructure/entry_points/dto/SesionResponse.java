package com.gimnasio.transmoderno.sesiones.infrastructure.entry_points.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@AllArgsConstructor
public class SesionResponse {
    private Long id;
    private Long rutaId;
    private Long creadaPor;
    private String nombre;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
}