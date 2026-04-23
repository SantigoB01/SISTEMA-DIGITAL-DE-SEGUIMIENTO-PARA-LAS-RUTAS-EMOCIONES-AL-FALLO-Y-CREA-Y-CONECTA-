package com.gimnasio.transmoderno.rutas.domain.usecase;

import com.gimnasio.transmoderno.rutas.domain.exception.RutaNoEncontradaException;
import com.gimnasio.transmoderno.rutas.domain.model.Ruta;
import com.gimnasio.transmoderno.rutas.domain.model.port.RutaRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ObtenerRutaPorIdUseCase {

    private final RutaRepository rutaRepository;

    public Ruta ejecutar(Long id) {
        return rutaRepository.findById(id)
                .orElseThrow(() -> new RutaNoEncontradaException(id.toString()));
    }
}