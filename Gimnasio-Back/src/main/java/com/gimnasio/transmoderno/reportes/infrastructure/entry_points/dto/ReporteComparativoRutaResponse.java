package com.gimnasio.transmoderno.reportes.infrastructure.entry_points.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ReporteComparativoRutaResponse {
    private Long rutaId;
    private String nombreRuta;
    private long totalParticipantesConAmbas;
    private double promedioGeneralPre;
    private double promedioGeneralPost;
    private double diferenciaGeneral;
    private List<ReporteComparativoPreguntaResponse> porPregunta;
}
