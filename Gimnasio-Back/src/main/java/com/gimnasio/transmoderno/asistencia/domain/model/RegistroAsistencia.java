package com.gimnasio.transmoderno.asistencia.domain.model;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistroAsistencia {
    private Long id;
    private Long participanteId;
    private Long sesionId;
    private LocalDateTime fechaHoraRegistro;
}