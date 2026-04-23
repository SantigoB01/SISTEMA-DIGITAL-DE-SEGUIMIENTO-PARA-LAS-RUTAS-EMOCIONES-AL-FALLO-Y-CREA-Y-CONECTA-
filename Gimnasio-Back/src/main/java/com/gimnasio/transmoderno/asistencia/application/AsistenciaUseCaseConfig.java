package com.gimnasio.transmoderno.asistencia.application;

import com.gimnasio.transmoderno.asistencia.domain.model.port.RegistroAsistenciaRepository;
import com.gimnasio.transmoderno.asistencia.domain.usecase.*;
import com.gimnasio.transmoderno.inscripciones.domain.model.port.InscripcionRepository;
import com.gimnasio.transmoderno.participantes.domain.model.port.ParticipanteRepository;
import com.gimnasio.transmoderno.sesiones.domain.model.port.SesionRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AsistenciaUseCaseConfig {

    @Bean
    public RegistrarAsistenciaUseCase registrarAsistenciaUseCase(
            RegistroAsistenciaRepository registroAsistenciaRepository,
            ParticipanteRepository participanteRepository,
            SesionRepository sesionRepository,
            InscripcionRepository inscripcionRepository) {
        return new RegistrarAsistenciaUseCase(
                registroAsistenciaRepository,
                participanteRepository,
                sesionRepository,
                inscripcionRepository
        );
    }

    @Bean
    public ObtenerAsistenciasPorSesionUseCase obtenerAsistenciasPorSesionUseCase(
            RegistroAsistenciaRepository registroAsistenciaRepository) {
        return new ObtenerAsistenciasPorSesionUseCase(registroAsistenciaRepository);
    }

    @Bean
    public ObtenerAsistenciasPorParticipanteUseCase obtenerAsistenciasPorParticipanteUseCase(
            RegistroAsistenciaRepository registroAsistenciaRepository,
            ParticipanteRepository participanteRepository) {
        return new ObtenerAsistenciasPorParticipanteUseCase(
                registroAsistenciaRepository,
                participanteRepository
        );
    }
}