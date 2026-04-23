package com.gimnasio.transmoderno.participantes.domain.usecase;

import com.gimnasio.transmoderno.participantes.domain.model.Participante;
import com.gimnasio.transmoderno.participantes.domain.model.port.ParticipanteRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class ObtenerParticipantesUseCase {

    private final ParticipanteRepository participanteRepository;

    public List<Participante> ejecutar(int page, int size) {
        return participanteRepository.findAll(page, size);
    }

    public long contarTotal() {
        return participanteRepository.count();
    }

    public List<Participante> ejecutarPorNombre(String nombre, int page, int size) {
        return participanteRepository.findByNombre(nombre, page, size);
    }

    public long contarPorNombre(String nombre) {
        return participanteRepository.countByNombre(nombre);
    }

    public List<Participante> ejecutarTodos() {
        return participanteRepository.findAll(0, Integer.MAX_VALUE);
    }

}