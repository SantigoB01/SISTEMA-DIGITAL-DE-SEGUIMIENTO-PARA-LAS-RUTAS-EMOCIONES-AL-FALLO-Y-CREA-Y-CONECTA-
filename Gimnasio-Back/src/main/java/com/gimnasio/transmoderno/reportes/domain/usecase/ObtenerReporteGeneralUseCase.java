package com.gimnasio.transmoderno.reportes.domain.usecase;

import com.gimnasio.transmoderno.reportes.domain.model.ReporteGeneral;
import com.gimnasio.transmoderno.reportes.domain.model.port.ReporteRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ObtenerReporteGeneralUseCase {

    private final ReporteRepository reporteRepository;

    public ReporteGeneral ejecutar() {
        return reporteRepository.reporteGeneral();
    }
}
