package com.gimnasio.transmoderno.alertas.domain.usecase;

import com.gimnasio.transmoderno.alertas.domain.model.SolicitudAyuda;
import com.gimnasio.transmoderno.alertas.domain.model.port.SolicitudAyudaRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class ObtenerSolicitudesAyudaUseCase {

    private final SolicitudAyudaRepository solicitudAyudaRepository;

    public List<SolicitudAyuda> ejecutar(int page, int size) {
        return solicitudAyudaRepository.findAll(page, size);
    }

    public long contarTotal() {
        return solicitudAyudaRepository.count();
    }
}