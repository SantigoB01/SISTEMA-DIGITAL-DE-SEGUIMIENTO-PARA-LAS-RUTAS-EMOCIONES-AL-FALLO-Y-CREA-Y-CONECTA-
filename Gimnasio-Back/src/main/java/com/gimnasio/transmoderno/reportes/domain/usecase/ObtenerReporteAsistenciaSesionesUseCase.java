package com.gimnasio.transmoderno.reportes.domain.usecase;

import com.gimnasio.transmoderno.reportes.domain.model.ReporteAsistenciaSesion;
import com.gimnasio.transmoderno.reportes.domain.model.port.ReporteRepository;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
public class ObtenerReporteAsistenciaSesionesUseCase {

    private final ReporteRepository reporteRepository;

    public List<ReporteAsistenciaSesion> ejecutar(Long rutaId, LocalDate desde, LocalDate hasta) {
        return reporteRepository.asistenciaPorSesiones(rutaId, desde, hasta);
    }
}
