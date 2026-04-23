package com.gimnasio.transmoderno.rutas.domain.usecase;

import com.gimnasio.transmoderno.rutas.domain.exception.RutaNoEncontradaException;
import com.gimnasio.transmoderno.rutas.domain.exception.RutaYaExisteException;
import com.gimnasio.transmoderno.rutas.domain.model.Ruta;
import com.gimnasio.transmoderno.rutas.domain.model.port.RutaRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ActualizarRutaUseCase {

    private final RutaRepository rutaRepository;

    public Ruta ejecutar(Long id, Ruta rutaActualizada) {
        Ruta existente = rutaRepository.findById(id)
                .orElseThrow(() -> new RutaNoEncontradaException(id.toString()));

        if (!existente.getNombre().equals(rutaActualizada.getNombre())) {
            rutaRepository.findByNombre(rutaActualizada.getNombre())
                    .ifPresent(r -> { throw new RutaYaExisteException(rutaActualizada.getNombre()); });
        }

        existente.setNombre(rutaActualizada.getNombre());
        existente.setDescripcion(rutaActualizada.getDescripcion());

        return rutaRepository.save(existente);
    }
}