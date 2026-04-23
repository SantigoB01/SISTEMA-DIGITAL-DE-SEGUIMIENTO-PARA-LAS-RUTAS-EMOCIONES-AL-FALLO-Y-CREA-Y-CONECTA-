package com.gimnasio.transmoderno.participantes.domain.usecase;

import com.gimnasio.transmoderno.participantes.domain.exception.ParticipanteNoEncontradoException;
import com.gimnasio.transmoderno.participantes.domain.model.Participante;
import com.gimnasio.transmoderno.participantes.domain.model.port.ParticipanteRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ObtenerParticipantePorIdentificacionUseCase {

    private final ParticipanteRepository participanteRepository;

    public Participante ejecutar(String numeroIdentificacion) {
        return participanteRepository.findByNumeroIdentificacion(numeroIdentificacion)
                .orElseThrow(() -> new ParticipanteNoEncontradoException(numeroIdentificacion));
    }
}