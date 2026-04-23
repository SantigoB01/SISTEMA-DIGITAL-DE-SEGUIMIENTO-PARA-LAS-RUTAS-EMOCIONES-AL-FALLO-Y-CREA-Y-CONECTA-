package com.gimnasio.transmoderno.rutas.domain.usecase;

import com.gimnasio.transmoderno.rutas.domain.exception.RutaNoEncontradaException;
import com.gimnasio.transmoderno.rutas.domain.model.Ruta;
import com.gimnasio.transmoderno.rutas.domain.model.port.RutaRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class DesactivarRutaUseCase {

    private final RutaRepository rutaRepository;

    public void ejecutar(Long id) {
        Ruta ruta = rutaRepository.findById(id)
                .orElseThrow(() -> new RutaNoEncontradaException(id.toString()));
        ruta.setActiva(false);
        rutaRepository.save(ruta);
    }
}