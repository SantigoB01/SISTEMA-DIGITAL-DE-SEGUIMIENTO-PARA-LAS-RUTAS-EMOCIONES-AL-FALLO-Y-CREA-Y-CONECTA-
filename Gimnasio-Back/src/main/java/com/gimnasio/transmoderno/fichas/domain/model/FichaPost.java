package com.gimnasio.transmoderno.fichas.domain.model;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FichaPost {
    private Long id;
    private Long fichaPreId;
    private LocalDateTime fechaDiligenciamiento;
    private Boolean completada;
    private List<RespuestaFicha> respuestas;
}