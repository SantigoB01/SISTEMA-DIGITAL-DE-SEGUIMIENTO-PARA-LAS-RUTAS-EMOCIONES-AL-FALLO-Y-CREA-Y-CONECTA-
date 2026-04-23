package com.gimnasio.transmoderno.reportes.domain.usecase;

import com.gimnasio.transmoderno.reportes.domain.model.ReporteFichas;
import com.gimnasio.transmoderno.reportes.domain.model.port.ReporteFichasPort;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class ObtenerReporteFichasUseCase {

    private final ReporteFichasPort reporteFichasPort;

    public List<ReporteFichas> comparativaPrePost(Long rutaId, String programaAcademico) {
        return reporteFichasPort.obtenerComparativaPrePost(rutaId, programaAcademico);
    }
}