package com.gimnasio.transmoderno.alertas.domain.model.port;

import com.gimnasio.transmoderno.alertas.domain.model.SolicitudAyuda;
import java.util.List;
import java.util.Optional;

public interface SolicitudAyudaRepository {
    SolicitudAyuda save(SolicitudAyuda solicitudAyuda);
    Optional<SolicitudAyuda> findById(Long id);
    List<SolicitudAyuda> findAll(int page, int size);
    long count();
}