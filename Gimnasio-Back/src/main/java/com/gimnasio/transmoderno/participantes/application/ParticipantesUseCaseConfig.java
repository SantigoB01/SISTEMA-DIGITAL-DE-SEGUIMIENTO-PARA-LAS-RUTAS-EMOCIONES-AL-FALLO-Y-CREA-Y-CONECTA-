package com.gimnasio.transmoderno.participantes.application;

import com.gimnasio.transmoderno.participantes.domain.model.port.EstudianteUcundinamarcaRepository;
import com.gimnasio.transmoderno.participantes.domain.model.port.ParticipanteRepository;
import com.gimnasio.transmoderno.participantes.domain.usecase.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ParticipantesUseCaseConfig {

    @Bean
    public RegistrarParticipanteUseCase registrarParticipanteUseCase(ParticipanteRepository participanteRepository) {
        return new RegistrarParticipanteUseCase(participanteRepository);
    }

    @Bean
    public ObtenerParticipantesUseCase obtenerParticipantesUseCase(ParticipanteRepository participanteRepository) {
        return new ObtenerParticipantesUseCase(participanteRepository);
    }

    @Bean
    public ObtenerParticipantePorIdentificacionUseCase obtenerParticipantePorIdentificacionUseCase(ParticipanteRepository participanteRepository) {
        return new ObtenerParticipantePorIdentificacionUseCase(participanteRepository);
    }

    @Bean
    public ActualizarParticipanteUseCase actualizarParticipanteUseCase(ParticipanteRepository participanteRepository) {
        return new ActualizarParticipanteUseCase(participanteRepository);
    }

    @Bean
    public DesactivarParticipanteUseCase desactivarParticipanteUseCase(ParticipanteRepository participanteRepository) {
        return new DesactivarParticipanteUseCase(participanteRepository);
    }

    @Bean
    public BuscarEstudianteUcundinamarcaUseCase buscarEstudianteUcundinamarcaUseCase(EstudianteUcundinamarcaRepository estudianteUcundinamarcaRepository) {
        return new BuscarEstudianteUcundinamarcaUseCase(estudianteUcundinamarcaRepository);
    }
}