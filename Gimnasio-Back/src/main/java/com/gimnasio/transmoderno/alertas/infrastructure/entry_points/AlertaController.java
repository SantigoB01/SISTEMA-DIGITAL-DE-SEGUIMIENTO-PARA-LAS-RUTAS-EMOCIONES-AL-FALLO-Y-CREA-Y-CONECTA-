package com.gimnasio.transmoderno.alertas.infrastructure.entry_points;

import com.gimnasio.transmoderno.alertas.domain.model.AlertaInasistencia;
import com.gimnasio.transmoderno.alertas.domain.model.SolicitudAyuda;
import com.gimnasio.transmoderno.alertas.domain.usecase.*;
import com.gimnasio.transmoderno.alertas.infrastructure.entry_points.dto.*;
import com.gimnasio.transmoderno.shared.dto.PaginaResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/alertas")
@RequiredArgsConstructor
public class AlertaController {

    private final CrearSolicitudAyudaUseCase crearSolicitudAyudaUseCase;
    private final ObtenerSolicitudesAyudaUseCase obtenerSolicitudesAyudaUseCase;
    private final AtenderSolicitudAyudaUseCase atenderSolicitudAyudaUseCase;
    private final ObtenerAlertasInasistenciaUseCase obtenerAlertasInasistenciaUseCase;

    @PostMapping("/ayuda")
    public ResponseEntity<SolicitudAyudaResponse> crearSolicitud(
            @Valid @RequestBody CrearSolicitudAyudaRequest request) {
        SolicitudAyuda solicitud = crearSolicitudAyudaUseCase
                .ejecutar(request.getNumeroIdentificacion());
        return ResponseEntity.status(HttpStatus.CREATED).body(toSolicitudResponse(solicitud));
    }

    @GetMapping("/ayuda")
    @PreAuthorize("hasAnyRole('ADMIN', 'PSICOLOGO')")
    public ResponseEntity<PaginaResponse<SolicitudAyudaResponse>> obtenerSolicitudes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<SolicitudAyuda> solicitudes = obtenerSolicitudesAyudaUseCase.ejecutar(page, size);
        long total = obtenerSolicitudesAyudaUseCase.contarTotal();

        PaginaResponse<SolicitudAyudaResponse> respuesta = new PaginaResponse<>(
                solicitudes.stream().map(this::toSolicitudResponse).collect(Collectors.toList()),
                page,
                (int) Math.ceil((double) total / size),
                total,
                size
        );

        return ResponseEntity.ok(respuesta);
    }

    @PatchMapping("/ayuda/{id}/atender")
    @PreAuthorize("hasAnyRole('ADMIN', 'PSICOLOGO')")
    public ResponseEntity<SolicitudAyudaResponse> atender(
            @PathVariable Long id,
            Authentication authentication) {
        Long usuarioId = (Long) authentication.getDetails();
        SolicitudAyuda solicitud = atenderSolicitudAyudaUseCase.ejecutar(id, usuarioId);
        return ResponseEntity.ok(toSolicitudResponse(solicitud));
    }

    @GetMapping("/inasistencia")
    @PreAuthorize("hasAnyRole('ADMIN', 'ENCARGADO')")
    public ResponseEntity<List<AlertaInasistenciaResponse>> obtenerInasistencias() {
        List<AlertaInasistenciaResponse> alertas = obtenerAlertasInasistenciaUseCase.ejecutar()
                .stream()
                .map(this::toInasistenciaResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(alertas);
    }

    private SolicitudAyudaResponse toSolicitudResponse(SolicitudAyuda solicitud) {
        return new SolicitudAyudaResponse(
                solicitud.getId(),
                solicitud.getParticipanteId(),
                solicitud.getAtendidaPor(),
                solicitud.getFechaHora(),
                solicitud.getAtendida(),
                solicitud.getFechaAtencion()
        );
    }

    private AlertaInasistenciaResponse toInasistenciaResponse(AlertaInasistencia alerta) {
        return new AlertaInasistenciaResponse(
                alerta.getParticipanteId(),
                alerta.getNumeroIdentificacion(),
                alerta.getNombreCompleto(),
                alerta.getRutaId(),
                alerta.getNombreRuta(),
                alerta.getUltimaAsistencia(),
                alerta.getDiasSinAsistir(),
                alerta.getNivelRiesgo()
        );
    }
}