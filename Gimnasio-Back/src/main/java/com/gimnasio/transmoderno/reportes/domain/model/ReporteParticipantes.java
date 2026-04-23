package com.gimnasio.transmoderno.reportes.domain.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReporteParticipantes {
    private String etiqueta;
    private Long total;
}