package com.gimnasio.transmoderno.rutas.application;

import com.gimnasio.transmoderno.rutas.domain.model.port.RutaRepository;
import com.gimnasio.transmoderno.rutas.domain.usecase.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RutasUseCaseConfig {

    @Bean
    public CrearRutaUseCase crearRutaUseCase(RutaRepository rutaRepository) {
        return new CrearRutaUseCase(rutaRepository);
    }

    @Bean
    public ObtenerRutasUseCase obtenerRutasUseCase(RutaRepository rutaRepository) {
        return new ObtenerRutasUseCase(rutaRepository);
    }

    @Bean
    public ObtenerRutaPorIdUseCase obtenerRutaPorIdUseCase(RutaRepository rutaRepository) {
        return new ObtenerRutaPorIdUseCase(rutaRepository);
    }

    @Bean
    public ActualizarRutaUseCase actualizarRutaUseCase(RutaRepository rutaRepository) {
        return new ActualizarRutaUseCase(rutaRepository);
    }

    @Bean
    public DesactivarRutaUseCase desactivarRutaUseCase(RutaRepository rutaRepository) {
        return new DesactivarRutaUseCase(rutaRepository);
    }

    @Bean
    public ReactivarRutaUseCase reactivarRutaUseCase(RutaRepository rutaRepository) {
        return new ReactivarRutaUseCase(rutaRepository);
    }
}