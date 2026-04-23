package com.gimnasio.transmoderno.inscripciones.domain.usecase;

import com.gimnasio.transmoderno.inscripciones.domain.model.Inscripcion;
import com.gimnasio.transmoderno.inscripciones.domain.model.port.InscripcionRepository;
import com.gimnasio.transmoderno.participantes.domain.exception.ParticipanteNoEncontradoException;
import com.gimnasio.transmoderno.participantes.domain.model.port.ParticipanteRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class ObtenerInscripcionesPorParticipanteUseCase {

    private final InscripcionRepository inscripcionRepository;
    private final ParticipanteRepository participanteRepository;

    public List<Inscripcion> ejecutar(String numeroIdentificacion) {
        var participante = participanteRepository
                .findByNumeroIdentificacion(numeroIdentificacion)
                .orElseThrow(() -> new ParticipanteNoEncontradoException(numeroIdentificacion));

        return inscripcionRepository.findByParticipanteId(participante.getId());
    }
}