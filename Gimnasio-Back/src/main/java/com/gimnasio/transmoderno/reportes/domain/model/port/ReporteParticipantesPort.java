package com.gimnasio.transmoderno.reportes.domain.model.port;

import com.gimnasio.transmoderno.reportes.domain.model.ReporteParticipantes;
import java.util.List;

public interface ReporteParticipantesPort {
    List<ReporteParticipantes> obtenerDistribucionPorPrograma(Long rutaId, Integer semestre);
    List<ReporteParticipantes> obtenerDistribucionPorSemestre(Long rutaId, String programaAcademico);
    List<ReporteParticipantes> obtenerParticipantesPorRuta();
}