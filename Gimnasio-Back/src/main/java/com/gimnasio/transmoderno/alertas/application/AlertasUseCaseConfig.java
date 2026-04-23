package com.gimnasio.transmoderno.alertas.application;

import com.gimnasio.transmoderno.alertas.domain.model.port.AlertaInasistenciaPort;
import com.gimnasio.transmoderno.alertas.domain.model.port.SolicitudAyudaRepository;
import com.gimnasio.transmoderno.alertas.domain.usecase.*;
import com.gimnasio.transmoderno.participantes.domain.model.port.ParticipanteRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AlertasUseCaseConfig {

    @Bean
    public CrearSolicitudAyudaUseCase crearSolicitudAyudaUseCase(
            SolicitudAyudaRepository solicitudAyudaRepository,
            ParticipanteRepository participanteRepository) {
        return new CrearSolicitudAyudaUseCase(solicitudAyudaRepository, participanteRepository);
    }

    @Bean
    public ObtenerSolicitudesAyudaUseCase obtenerSolicitudesAyudaUseCase(
            SolicitudAyudaRepository solicitudAyudaRepository) {
        return new ObtenerSolicitudesAyudaUseCase(solicitudAyudaRepository);
    }

    @Bean
    public AtenderSolicitudAyudaUseCase atenderSolicitudAyudaUseCase(
            SolicitudAyudaRepository solicitudAyudaRepository) {
        return new AtenderSolicitudAyudaUseCase(solicitudAyudaRepository);
    }

    @Bean
    public ObtenerAlertasInasistenciaUseCase obtenerAlertasInasistenciaUseCase(
            AlertaInasistenciaPort alertaInasistenciaPort) {
        return new ObtenerAlertasInasistenciaUseCase(alertaInasistenciaPort);
    }
}