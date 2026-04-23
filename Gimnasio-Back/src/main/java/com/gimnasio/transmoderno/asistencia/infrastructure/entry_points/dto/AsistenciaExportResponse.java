package com.gimnasio.transmoderno.asistencia.infrastructure.entry_points.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class AsistenciaExportResponse {
    private Long id;
    private String numeroIdentificacion;
    private String nombreCompleto;
    private String programaAcademico;
    private Integer semestre;
    private String sesionNombre;
    private String sesionFecha;
    private LocalDateTime fechaHoraRegistro;
}