package com.gimnasio.transmoderno.rutas.domain.model.port;

import com.gimnasio.transmoderno.rutas.domain.model.Ruta;
import java.util.List;
import java.util.Optional;

public interface RutaRepository {
    Ruta save(Ruta ruta);
    Optional<Ruta> findById(Long id);
    Optional<Ruta> findByNombre(String nombre);
    List<Ruta> findAll();
}