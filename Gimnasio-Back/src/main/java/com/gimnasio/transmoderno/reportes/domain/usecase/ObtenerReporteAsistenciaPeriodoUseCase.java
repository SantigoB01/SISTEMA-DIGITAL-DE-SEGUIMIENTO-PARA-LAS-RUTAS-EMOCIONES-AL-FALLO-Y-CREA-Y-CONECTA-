package com.gimnasio.transmoderno.reportes.domain.usecase;

import com.gimnasio.transmoderno.reportes.domain.model.ReporteAsistenciaPeriodo;
import com.gimnasio.transmoderno.reportes.domain.model.port.ReporteRepository;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

@RequiredArgsConstructor
public class ObtenerReporteAsistenciaPeriodoUseCase {

    private final ReporteRepository reporteRepository;

    public ReporteAsistenciaPeriodo ejecutar(Long rutaId, LocalDate desde, LocalDate hasta) {
        return reporteRepository.asistenciaPorPeriodo(rutaId, desde, hasta);
    }
}
