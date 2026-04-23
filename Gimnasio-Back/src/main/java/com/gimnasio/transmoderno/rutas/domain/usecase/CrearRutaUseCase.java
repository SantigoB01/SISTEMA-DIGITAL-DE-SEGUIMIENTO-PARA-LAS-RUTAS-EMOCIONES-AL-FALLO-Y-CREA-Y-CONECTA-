package com.gimnasio.transmoderno.rutas.domain.usecase;

import com.gimnasio.transmoderno.rutas.domain.exception.RutaYaExisteException;
import com.gimnasio.transmoderno.rutas.domain.model.Ruta;
import com.gimnasio.transmoderno.rutas.domain.model.port.RutaRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CrearRutaUseCase {

    private final RutaRepository rutaRepository;

    public Ruta ejecutar(Ruta ruta) {
        rutaRepository.findByNombre(ruta.getNombre())
                .ifPresent(r -> { throw new RutaYaExisteException(ruta.getNombre()); });
        return rutaRepository.save(ruta);
    }
}