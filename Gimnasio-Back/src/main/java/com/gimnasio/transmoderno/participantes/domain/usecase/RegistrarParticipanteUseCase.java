package com.gimnasio.transmoderno.participantes.domain.usecase;

import com.gimnasio.transmoderno.participantes.domain.exception.ParticipanteYaExisteException;
import com.gimnasio.transmoderno.participantes.domain.model.Participante;
import com.gimnasio.transmoderno.participantes.domain.model.port.ParticipanteRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class RegistrarParticipanteUseCase {

    private final ParticipanteRepository participanteRepository;

    public Participante ejecutar(Participante participante) {
        participanteRepository.findByNumeroIdentificacion(participante.getNumeroIdentificacion())
                .ifPresent(p -> { throw new ParticipanteYaExisteException(participante.getNumeroIdentificacion()); });

        return participanteRepository.save(participante);
    }
}