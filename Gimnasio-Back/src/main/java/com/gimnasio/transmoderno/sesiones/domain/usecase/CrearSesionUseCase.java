package com.gimnasio.transmoderno.sesiones.domain.usecase;

import com.gimnasio.transmoderno.sesiones.domain.model.Sesion;
import com.gimnasio.transmoderno.sesiones.domain.model.port.SesionRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CrearSesionUseCase {

    private final SesionRepository sesionRepository;

    public Sesion ejecutar(Sesion sesion) {
        return sesionRepository.save(sesion);
    }
}