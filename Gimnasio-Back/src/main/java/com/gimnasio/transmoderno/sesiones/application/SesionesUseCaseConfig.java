package com.gimnasio.transmoderno.sesiones.application;

import com.gimnasio.transmoderno.sesiones.domain.model.port.SesionRepository;
import com.gimnasio.transmoderno.sesiones.domain.usecase.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SesionesUseCaseConfig {

    @Bean
    public CrearSesionUseCase crearSesionUseCase(SesionRepository sesionRepository) {
        return new CrearSesionUseCase(sesionRepository);
    }

    @Bean
    public ObtenerSesionesPorRutaUseCase obtenerSesionesPorRutaUseCase(
            SesionRepository sesionRepository) {
        return new ObtenerSesionesPorRutaUseCase(sesionRepository);
    }

    @Bean
    public ObtenerSesionActivaUseCase obtenerSesionActivaUseCase(
            SesionRepository sesionRepository) {
        return new ObtenerSesionActivaUseCase(sesionRepository);
    }

    @Bean
    public EliminarSesionUseCase eliminarSesionUseCase(SesionRepository sesionRepository) {
        return new EliminarSesionUseCase(sesionRepository);
    }

    @Bean
    public ObtenerSesionPorIdUseCase obtenerSesionPorIdUseCase(SesionRepository sesionRepository) {
        return new ObtenerSesionPorIdUseCase(sesionRepository);
    }
}