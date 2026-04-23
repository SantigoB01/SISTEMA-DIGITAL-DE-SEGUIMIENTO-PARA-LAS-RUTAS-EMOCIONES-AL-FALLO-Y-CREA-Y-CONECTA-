package com.gimnasio.transmoderno.asistencia.domain.usecase;

import com.gimnasio.transmoderno.asistencia.domain.model.RegistroAsistencia;
import com.gimnasio.transmoderno.asistencia.domain.model.port.RegistroAsistenciaRepository;
import com.gimnasio.transmoderno.participantes.domain.exception.ParticipanteNoEncontradoException;
import com.gimnasio.transmoderno.participantes.domain.model.port.ParticipanteRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class ObtenerAsistenciasPorParticipanteUseCase {

    private final RegistroAsistenciaRepository registroAsistenciaRepository;
    private final ParticipanteRepository participanteRepository;

    public List<RegistroAsistencia> ejecutar(String numeroIdentificacion, int page, int size) {
        var participante = participanteRepository
                .findByNumeroIdentificacion(numeroIdentificacion)
                .orElseThrow(() -> new ParticipanteNoEncontradoException(numeroIdentificacion));

        return registroAsistenciaRepository.findByParticipanteId(participante.getId(), page, size);
    }

    public long contarTotal(String numeroIdentificacion) {
        var participante = participanteRepository
                .findByNumeroIdentificacion(numeroIdentificacion)
                .orElseThrow(() -> new ParticipanteNoEncontradoException(numeroIdentificacion));

        return registroAsistenciaRepository.countByParticipanteId(participante.getId());
    }
}