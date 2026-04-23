package com.gimnasio.transmoderno.sesiones.domain.usecase;

import com.gimnasio.transmoderno.sesiones.domain.exception.SesionNoEncontradaException;
import com.gimnasio.transmoderno.sesiones.domain.model.port.SesionRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class EliminarSesionUseCase {

    private final SesionRepository sesionRepository;

    public void ejecutar(Long id) {
        sesionRepository.findById(id)
                .orElseThrow(() -> new SesionNoEncontradaException(id.toString()));
        sesionRepository.deleteById(id);
    }
}