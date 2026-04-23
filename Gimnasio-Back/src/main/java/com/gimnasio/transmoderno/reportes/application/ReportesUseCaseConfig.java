package com.gimnasio.transmoderno.reportes.application;

import com.gimnasio.transmoderno.inscripciones.domain.model.port.InscripcionRepository;
import com.gimnasio.transmoderno.reportes.domain.model.port.ReporteAsistenciaPort;
import com.gimnasio.transmoderno.reportes.domain.model.port.ReporteFichasPort;
import com.gimnasio.transmoderno.reportes.domain.model.port.ReporteParticipantesPort;
import com.gimnasio.transmoderno.reportes.domain.usecase.*;
import com.gimnasio.transmoderno.rutas.domain.model.port.RutaRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ReportesUseCaseConfig {

    @Bean
    public ObtenerReporteAsistenciaUseCase obtenerReporteAsistenciaUseCase(
            ReporteAsistenciaPort reporteAsistenciaPort) {
        return new ObtenerReporteAsistenciaUseCase(reporteAsistenciaPort);
    }

    @Bean
    public ObtenerReporteParticipantesUseCase obtenerReporteParticipantesUseCase(
            ReporteParticipantesPort reporteParticipantesPort) {
        return new ObtenerReporteParticipantesUseCase(reporteParticipantesPort);
    }

    @Bean
    public ObtenerReporteFichasUseCase obtenerReporteFichasUseCase(
            ReporteFichasPort reporteFichasPort) {
        return new ObtenerReporteFichasUseCase(reporteFichasPort);
    }

    @Bean
    public ObtenerRetencionUseCase obtenerRetencionUseCase(
            InscripcionRepository inscripcionRepository,
            RutaRepository rutaRepository) {
        return new ObtenerRetencionUseCase(inscripcionRepository, rutaRepository);
    }
}