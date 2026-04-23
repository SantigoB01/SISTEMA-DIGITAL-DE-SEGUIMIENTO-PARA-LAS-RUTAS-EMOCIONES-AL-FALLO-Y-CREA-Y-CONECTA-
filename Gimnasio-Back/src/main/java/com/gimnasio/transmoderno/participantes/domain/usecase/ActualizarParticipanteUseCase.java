package com.gimnasio.transmoderno.participantes.domain.usecase;

import com.gimnasio.transmoderno.participantes.domain.exception.ParticipanteNoEncontradoException;
import com.gimnasio.transmoderno.participantes.domain.exception.ParticipanteYaExisteException;
import com.gimnasio.transmoderno.participantes.domain.model.Participante;
import com.gimnasio.transmoderno.participantes.domain.model.port.ParticipanteRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ActualizarParticipanteUseCase {

    private final ParticipanteRepository participanteRepository;

    public Participante ejecutar(Long id, Participante participanteActualizado) {
        Participante existente = participanteRepository.findById(id)
                .orElseThrow(() -> new ParticipanteNoEncontradoException(id.toString()));

        if (!existente.getNumeroIdentificacion().equals(participanteActualizado.getNumeroIdentificacion())) {
            participanteRepository.findByNumeroIdentificacion(participanteActualizado.getNumeroIdentificacion())
                    .ifPresent(p -> { throw new ParticipanteYaExisteException(participanteActualizado.getNumeroIdentificacion()); });
        }

        existente.setNumeroIdentificacion(participanteActualizado.getNumeroIdentificacion());
        existente.setNombreCompleto(participanteActualizado.getNombreCompleto());
        existente.setCorreoInstitucional(participanteActualizado.getCorreoInstitucional());
        existente.setProgramaAcademico(participanteActualizado.getProgramaAcademico());
        existente.setSemestre(participanteActualizado.getSemestre());

        return participanteRepository.save(existente);
    }
}