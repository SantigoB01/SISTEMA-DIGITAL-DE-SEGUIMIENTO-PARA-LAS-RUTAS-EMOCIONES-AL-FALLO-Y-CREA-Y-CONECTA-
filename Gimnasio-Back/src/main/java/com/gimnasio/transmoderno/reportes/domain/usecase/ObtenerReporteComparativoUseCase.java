package com.gimnasio.transmoderno.reportes.domain.usecase;

import com.gimnasio.transmoderno.reportes.domain.model.ReporteComparativoRuta;
import com.gimnasio.transmoderno.reportes.domain.model.port.ReporteRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ObtenerReporteComparativoUseCase {

    private final ReporteRepository reporteRepository;

    public ReporteComparativoRuta ejecutar(Long rutaId) {
        return reporteRepository.comparativoPrePostPorRuta(rutaId);
    }
}
