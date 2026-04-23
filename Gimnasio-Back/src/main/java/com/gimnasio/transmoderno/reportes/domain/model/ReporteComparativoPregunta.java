package com.gimnasio.transmoderno.reportes.domain.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReporteComparativoPregunta {
    private Long preguntaId;
    private String textoPregunta;
    private Integer ordenPregunta;
    private double promedioPre;
    private double promedioPost;
    private double diferencia;
}
