package com.gimnasio.transmoderno.participantes.domain.usecase;

import com.gimnasio.transmoderno.participantes.domain.exception.EstudianteNoEncontradoException;
import com.gimnasio.transmoderno.participantes.domain.model.EstudianteUcundinamarca;
import com.gimnasio.transmoderno.participantes.domain.model.port.EstudianteUcundinamarcaRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class BuscarEstudianteUcundinamarcaUseCase {

    private final EstudianteUcundinamarcaRepository estudianteRepository;

    public EstudianteUcundinamarca ejecutar(String documento) {
        return estudianteRepository.findByDocumento(documento)
                .orElseThrow(() -> new EstudianteNoEncontradoException(documento));
    }

    public List<String> obtenerProgramas() {
        return estudianteRepository.findProgramasUnicos();
    }
}