package com.gimnasio.transmoderno.sesiones.domain.model;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sesion {
    private Long id;
    private Long rutaId;
    private Long creadaPor;
    private String nombre;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
}