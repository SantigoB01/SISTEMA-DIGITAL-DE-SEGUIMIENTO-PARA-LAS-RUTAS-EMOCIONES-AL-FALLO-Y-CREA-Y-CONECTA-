package com.gimnasio.transmoderno.reportes.domain.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReporteGeneral {
    // Participantes
    private long totalParticipantes;
    private long totalParticipantesActivos;

    // Rutas
    private long totalRutas;
    private long totalRutasActivas;

    // Inscripciones
    private long totalInscripciones;
    private long totalInscripcionesActivas;

    // Sesiones
    private long totalSesiones;

    // Asistencia
    private long totalRegistrosAsistencia;
    private double promedioAsistenciaGlobal;

    // Fichas
    private long totalFichasPreCompletadas;
    private long totalFichasPostCompletadas;
    private long totalParticipantesConCicloCompleto;

    // Alertas
    private long totalSolicitudesAyuda;
    private long totalSolicitudesAyudaAtendidas;
    private long totalSolicitudesAyudaPendientes;
}
