package com.gimnasio.transmoderno.sesiones.domain.usecase;

import com.gimnasio.transmoderno.sesiones.domain.exception.SesionNoEncontradaException;
import com.gimnasio.transmoderno.sesiones.domain.model.Sesion;
import com.gimnasio.transmoderno.sesiones.domain.model.port.SesionRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ObtenerSesionPorIdUseCase {

    private final SesionRepository sesionRepository;

    public Sesion ejecutar(Long id) {
        return sesionRepository.findById(id)
                .orElseThrow(() -> new SesionNoEncontradaException(id.toString()));
    }
}