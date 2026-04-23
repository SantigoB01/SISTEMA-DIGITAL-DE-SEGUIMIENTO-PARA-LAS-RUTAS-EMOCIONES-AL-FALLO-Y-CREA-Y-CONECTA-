package com.gimnasio.transmoderno.participantes.domain.usecase;

import com.gimnasio.transmoderno.participantes.domain.exception.ParticipanteNoEncontradoException;
import com.gimnasio.transmoderno.participantes.domain.model.Participante;
import com.gimnasio.transmoderno.participantes.domain.model.port.ParticipanteRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class DesactivarParticipanteUseCase {

    private final ParticipanteRepository participanteRepository;

    public void ejecutar(Long id) {
        Participante participante = participanteRepository.findById(id)
                .orElseThrow(() -> new ParticipanteNoEncontradoException(id.toString()));

        participante.setActivo(false);
        participanteRepository.save(participante);
    }
}