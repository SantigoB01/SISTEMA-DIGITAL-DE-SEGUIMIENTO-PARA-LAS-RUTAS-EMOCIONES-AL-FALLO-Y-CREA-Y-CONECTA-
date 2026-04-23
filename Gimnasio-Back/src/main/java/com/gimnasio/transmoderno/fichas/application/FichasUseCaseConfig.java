package com.gimnasio.transmoderno.fichas.application;

import com.gimnasio.transmoderno.fichas.domain.model.port.*;
import com.gimnasio.transmoderno.fichas.domain.usecase.*;
import com.gimnasio.transmoderno.inscripciones.domain.model.port.InscripcionRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FichasUseCaseConfig {

    @Bean
    public CrearPreguntaUseCase crearPreguntaUseCase(PreguntaRepository preguntaRepository) {
        return new CrearPreguntaUseCase(preguntaRepository);
    }

    @Bean
    public ObtenerPreguntasPorRutaUseCase obtenerPreguntasPorRutaUseCase(
            PreguntaRepository preguntaRepository) {
        return new ObtenerPreguntasPorRutaUseCase(preguntaRepository);
    }

    @Bean
    public ActualizarPreguntaUseCase actualizarPreguntaUseCase(
            PreguntaRepository preguntaRepository) {
        return new ActualizarPreguntaUseCase(preguntaRepository);
    }

    @Bean
    public DesactivarPreguntaUseCase desactivarPreguntaUseCase(
            PreguntaRepository preguntaRepository) {
        return new DesactivarPreguntaUseCase(preguntaRepository);
    }

    @Bean
    public CrearFichaPreUseCase crearFichaPreUseCase(
            FichaPreRepository fichaPreRepository,
            InscripcionRepository inscripcionRepository) {
        return new CrearFichaPreUseCase(fichaPreRepository, inscripcionRepository);
    }

    @Bean
    public ObtenerFichaPreUseCase obtenerFichaPreUseCase(FichaPreRepository fichaPreRepository) {
        return new ObtenerFichaPreUseCase(fichaPreRepository);
    }

    @Bean
    public CrearFichaPostUseCase crearFichaPostUseCase(
            FichaPostRepository fichaPostRepository,
            FichaPreRepository fichaPreRepository) {
        return new CrearFichaPostUseCase(fichaPostRepository, fichaPreRepository);
    }

    @Bean
    public ObtenerFichaPostUseCase obtenerFichaPostUseCase(
            FichaPostRepository fichaPostRepository) {
        return new ObtenerFichaPostUseCase(fichaPostRepository);
    }
}
