package com.gimnasio.transmoderno.reportes.domain.model;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReporteComparativoRuta {
    private Long rutaId;
    private String nombreRuta;
    private long totalParticipantesConAmbas;
    private double promedioGeneralPre;
    private double promedioGeneralPost;
    private double diferenciaGeneral;
    private List<ReporteComparativoPregunta> porPregunta;
}
