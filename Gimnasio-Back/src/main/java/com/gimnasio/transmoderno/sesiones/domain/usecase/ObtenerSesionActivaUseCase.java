package com.gimnasio.transmoderno.sesiones.domain.usecase;

import com.gimnasio.transmoderno.sesiones.domain.exception.SesionNoActivaException;
import com.gimnasio.transmoderno.sesiones.domain.model.Sesion;
import com.gimnasio.transmoderno.sesiones.domain.model.port.SesionRepository;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@RequiredArgsConstructor
public class ObtenerSesionActivaUseCase {

    private final SesionRepository sesionRepository;

    public Sesion ejecutar(Long rutaId) {
        LocalDate hoy = LocalDate.now();
        LocalTime ahora = LocalTime.now();

        return sesionRepository.findSesionActiva(rutaId, hoy, ahora)
                .orElseThrow(SesionNoActivaException::new);
    }
}