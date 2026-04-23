package com.gimnasio.transmoderno.sesiones.domain.model.port;

import com.gimnasio.transmoderno.sesiones.domain.model.Sesion;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface SesionRepository {
    Sesion save(Sesion sesion);
    Optional<Sesion> findById(Long id);
    List<Sesion> findByRutaId(Long rutaId, int page, int size);
    long countByRutaId(Long rutaId);
    Optional<Sesion> findSesionActiva(Long rutaId, LocalDate fecha, LocalTime horaActual);
    void deleteById(Long id);

}