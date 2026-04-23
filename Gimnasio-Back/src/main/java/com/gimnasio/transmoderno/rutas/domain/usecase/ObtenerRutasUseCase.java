package com.gimnasio.transmoderno.rutas.domain.usecase;

import com.gimnasio.transmoderno.rutas.domain.model.Ruta;
import com.gimnasio.transmoderno.rutas.domain.model.port.RutaRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class ObtenerRutasUseCase {

    private final RutaRepository rutaRepository;

    public List<Ruta> ejecutar() {
        return rutaRepository.findAll();
    }
}