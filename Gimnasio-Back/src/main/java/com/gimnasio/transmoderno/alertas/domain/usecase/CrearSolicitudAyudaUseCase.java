package com.gimnasio.transmoderno.alertas.domain.usecase;

import com.gimnasio.transmoderno.alertas.domain.model.SolicitudAyuda;
import com.gimnasio.transmoderno.alertas.domain.model.port.SolicitudAyudaRepository;
import com.gimnasio.transmoderno.participantes.domain.exception.ParticipanteNoEncontradoException;
import com.gimnasio.transmoderno.participantes.domain.model.port.ParticipanteRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CrearSolicitudAyudaUseCase {

    private final SolicitudAyudaRepository solicitudAyudaRepository;
    private final ParticipanteRepository participanteRepository;

    public SolicitudAyuda ejecutar(String numeroIdentificacion) {
        var participante = participanteRepository
                .findByNumeroIdentificacion(numeroIdentificacion)
                .orElseThrow(() -> new ParticipanteNoEncontradoException(numeroIdentificacion));

        SolicitudAyuda solicitud = SolicitudAyuda.builder()
                .participanteId(participante.getId())
                .atendida(false)
                .build();

        return solicitudAyudaRepository.save(solicitud);
    }
}