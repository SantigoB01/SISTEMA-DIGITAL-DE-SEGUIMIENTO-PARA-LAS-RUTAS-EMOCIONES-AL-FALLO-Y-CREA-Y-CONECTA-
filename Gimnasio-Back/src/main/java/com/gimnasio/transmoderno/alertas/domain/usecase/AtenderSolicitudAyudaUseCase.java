package com.gimnasio.transmoderno.alertas.domain.usecase;

import com.gimnasio.transmoderno.alertas.domain.exception.SolicitudAyudaNoEncontradaException;
import com.gimnasio.transmoderno.alertas.domain.model.SolicitudAyuda;
import com.gimnasio.transmoderno.alertas.domain.model.port.SolicitudAyudaRepository;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@RequiredArgsConstructor
public class AtenderSolicitudAyudaUseCase {

    private final SolicitudAyudaRepository solicitudAyudaRepository;

    public SolicitudAyuda ejecutar(Long id, Long usuarioId) {
        SolicitudAyuda solicitud = solicitudAyudaRepository.findById(id)
                .orElseThrow(() -> new SolicitudAyudaNoEncontradaException(id.toString()));

        solicitud.setAtendida(true);
        solicitud.setAtendidaPor(usuarioId);
        solicitud.setFechaAtencion(LocalDateTime.now());

        return solicitudAyudaRepository.save(solicitud);
    }
}