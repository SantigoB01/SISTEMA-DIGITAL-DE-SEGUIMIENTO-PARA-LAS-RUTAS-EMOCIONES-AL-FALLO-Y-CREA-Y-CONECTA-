package com.gimnasio.transmoderno.reportes.domain.usecase;

import com.gimnasio.transmoderno.reportes.domain.model.ReporteParticipantes;
import com.gimnasio.transmoderno.reportes.domain.model.port.ReporteParticipantesPort;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class ObtenerReporteParticipantesUseCase {

    private final ReporteParticipantesPort reporteParticipantesPort;

    public List<ReporteParticipantes> porPrograma(Long rutaId, Integer semestre) {
        return reporteParticipantesPort.obtenerDistribucionPorPrograma(rutaId, semestre);
    }

    public List<ReporteParticipantes> porSemestre(Long rutaId, String programaAcademico) {
        return reporteParticipantesPort.obtenerDistribucionPorSemestre(rutaId, programaAcademico);
    }

    public List<ReporteParticipantes> porRuta() {
        return reporteParticipantesPort.obtenerParticipantesPorRuta();
    }
}