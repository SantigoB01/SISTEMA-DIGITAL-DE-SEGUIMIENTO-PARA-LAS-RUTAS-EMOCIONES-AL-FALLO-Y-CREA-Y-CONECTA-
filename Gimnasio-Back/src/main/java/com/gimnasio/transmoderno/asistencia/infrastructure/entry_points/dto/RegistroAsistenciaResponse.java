package com.gimnasio.transmoderno.asistencia.infrastructure.entry_points.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class RegistroAsistenciaResponse {
    private Long id;
    private Long participanteId;
    private Long sesionId;
    private LocalDateTime fechaHoraRegistro;
}