package com.gimnasio.transmoderno.inscripciones.application;

import com.gimnasio.transmoderno.inscripciones.domain.model.port.InscripcionRepository;
import com.gimnasio.transmoderno.inscripciones.domain.usecase.*;
import com.gimnasio.transmoderno.participantes.domain.model.port.ParticipanteRepository;
import com.gimnasio.transmoderno.rutas.domain.model.port.RutaRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class InscripcionesUseCaseConfig {

    @Bean
    public InscribirParticipanteUseCase inscribirParticipanteUseCase(
            InscripcionRepository inscripcionRepository,
            ParticipanteRepository participanteRepository,
            RutaRepository rutaRepository) {
        return new InscribirParticipanteUseCase(inscripcionRepository, participanteRepository, rutaRepository);
    }

    @Bean
    public ObtenerInscripcionesUseCase obtenerInscripcionesUseCase(
            InscripcionRepository inscripcionRepository) {
        return new ObtenerInscripcionesUseCase(inscripcionRepository);
    }

    @Bean
    public ObtenerInscripcionesPorParticipanteUseCase obtenerInscripcionesPorParticipanteUseCase(
            InscripcionRepository inscripcionRepository,
            ParticipanteRepository participanteRepository) {
        return new ObtenerInscripcionesPorParticipanteUseCase(inscripcionRepository, participanteRepository);
    }

    @Bean
    public FinalizarInscripcionUseCase finalizarInscripcionUseCase(
            InscripcionRepository inscripcionRepository) {
        return new FinalizarInscripcionUseCase(inscripcionRepository);
    }

    @Bean
    public CancelarInscripcionUseCase cancelarInscripcionUseCase(
            InscripcionRepository inscripcionRepository) {
        return new CancelarInscripcionUseCase(inscripcionRepository);
    }

    @Bean
    public DesactivarInscripcionesPorParticipanteUseCase desactivarInscripcionesPorParticipanteUseCase(
            InscripcionRepository inscripcionRepository) {
        return new DesactivarInscripcionesPorParticipanteUseCase(inscripcionRepository);
    }

    @Bean
    public CerrarSemestreUseCase cerrarSemestreUseCase(
            InscripcionRepository inscripcionRepository) {
        return new CerrarSemestreUseCase(inscripcionRepository);
    }
}