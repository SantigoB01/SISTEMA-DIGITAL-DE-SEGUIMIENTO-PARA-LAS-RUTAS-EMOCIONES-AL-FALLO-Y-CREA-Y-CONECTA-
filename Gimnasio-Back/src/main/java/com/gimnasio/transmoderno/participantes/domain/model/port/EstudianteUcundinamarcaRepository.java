package com.gimnasio.transmoderno.participantes.domain.model.port;

import com.gimnasio.transmoderno.participantes.domain.model.EstudianteUcundinamarca;

import java.util.List;
import java.util.Optional;

public interface EstudianteUcundinamarcaRepository {

    Optional<EstudianteUcundinamarca> findByDocumento(String documento);

    List<String> findProgramasUnicos();
}