package com.gimnasio.transmoderno.participantes.domain.model.port;

import com.gimnasio.transmoderno.participantes.domain.model.Participante;
import java.util.List;
import java.util.Optional;

public interface ParticipanteRepository {
    Participante save(Participante participante);
    Optional<Participante> findByNumeroIdentificacion(String numeroIdentificacion);
    Optional<Participante> findById(Long id);
    List<Participante> findAll(int page, int size);
    long count();
    List<Participante> findByNombre(String nombre, int page, int size);
    long countByNombre(String nombre);
}