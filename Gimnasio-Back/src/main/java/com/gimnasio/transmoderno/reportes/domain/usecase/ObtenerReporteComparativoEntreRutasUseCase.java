package com.gimnasio.transmoderno.reportes.domain.usecase;

import com.gimnasio.transmoderno.reportes.domain.model.ReporteComparativoEntreRutas;
import com.gimnasio.transmoderno.reportes.domain.model.port.ReporteRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ObtenerReporteComparativoEntreRutasUseCase {

    private final ReporteRepository reporteRepository;

    public ReporteComparativoEntreRutas ejecutar() {
        return reporteRepository.comparativoEntreRutas();
    }
}
