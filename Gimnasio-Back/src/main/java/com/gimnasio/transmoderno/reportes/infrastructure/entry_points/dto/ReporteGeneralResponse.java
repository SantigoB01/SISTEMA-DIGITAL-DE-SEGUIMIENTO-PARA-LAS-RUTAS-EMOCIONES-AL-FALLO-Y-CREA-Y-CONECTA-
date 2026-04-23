package com.gimnasio.transmoderno.reportes.infrastructure.entry_points.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReporteGeneralResponse {
    private long totalParticipantes;
    private long totalParticipantesActivos;
    private long totalRutas;
    private long totalRutasActivas;
    private long totalInscripciones;
    private long totalInscripcionesActivas;
    private long totalSesiones;
    private long totalRegistrosAsistencia;
    private double promedioAsistenciaGlobal;
    private long totalFichasPreCompletadas;
    private long totalFichasPostCompletadas;
    private long totalParticipantesConCicloCompleto;
    private long totalSolicitudesAyuda;
    private long totalSolicitudesAyudaAtendidas;
    private long totalSolicitudesAyudaPendientes;
}
