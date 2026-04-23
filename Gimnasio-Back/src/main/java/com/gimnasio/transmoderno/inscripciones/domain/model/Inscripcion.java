package com.gimnasio.transmoderno.inscripciones.domain.model;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inscripcion {
    private Long id;
    private Long participanteId;
    private Long rutaId;
    private LocalDateTime fechaInscripcion;
    private EstadoInscripcion estado;
}