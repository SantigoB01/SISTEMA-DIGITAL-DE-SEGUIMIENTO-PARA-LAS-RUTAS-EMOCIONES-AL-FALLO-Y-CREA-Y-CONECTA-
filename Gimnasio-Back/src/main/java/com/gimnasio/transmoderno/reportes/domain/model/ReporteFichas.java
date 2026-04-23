package com.gimnasio.transmoderno.reportes.domain.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReporteFichas {
    private String pregunta;
    private Double promedioPre;
    private Double promedioPost;
}