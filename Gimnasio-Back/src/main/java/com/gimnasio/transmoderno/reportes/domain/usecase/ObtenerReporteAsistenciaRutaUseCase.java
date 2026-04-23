package com.gimnasio.transmoderno.reportes.domain.usecase;

import com.gimnasio.transmoderno.reportes.domain.model.ReporteAsistenciaRuta;
import com.gimnasio.transmoderno.reportes.domain.model.port.ReporteRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ObtenerReporteAsistenciaRutaUseCase {

    private final ReporteRepository reporteRepository;

    public ReporteAsistenciaRuta ejecutar(Long rutaId) {
        return reporteRepository.asistenciaPorRuta(rutaId);
    }
}
