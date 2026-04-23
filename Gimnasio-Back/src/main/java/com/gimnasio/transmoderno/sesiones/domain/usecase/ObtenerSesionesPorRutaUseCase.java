package com.gimnasio.transmoderno.sesiones.domain.usecase;

import com.gimnasio.transmoderno.sesiones.domain.model.Sesion;
import com.gimnasio.transmoderno.sesiones.domain.model.port.SesionRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class ObtenerSesionesPorRutaUseCase {

    private final SesionRepository sesionRepository;

    public List<Sesion> ejecutar(Long rutaId, int page, int size) {
        return sesionRepository.findByRutaId(rutaId, page, size);
    }

    public long contarTotal(Long rutaId) {
        return sesionRepository.countByRutaId(rutaId);
    }
}