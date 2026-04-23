package com.gimnasio.transmoderno.inscripciones.infrastructure.entry_points;

import com.gimnasio.transmoderno.inscripciones.domain.model.Inscripcion;
import com.gimnasio.transmoderno.inscripciones.domain.usecase.*;
import com.gimnasio.transmoderno.inscripciones.infrastructure.entry_points.dto.*;
import com.gimnasio.transmoderno.participantes.domain.model.port.ParticipanteRepository;
import com.gimnasio.transmoderno.rutas.domain.model.port.RutaRepository;
import com.gimnasio.transmoderno.shared.dto.PaginaResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inscripciones")
@RequiredArgsConstructor
public class InscripcionController {

    private final InscribirParticipanteUseCase inscribirParticipanteUseCase;
    private final ObtenerInscripcionesUseCase obtenerInscripcionesUseCase;
    private final ObtenerInscripcionesPorParticipanteUseCase obtenerInscripcionesPorParticipanteUseCase;
    private final FinalizarInscripcionUseCase finalizarInscripcionUseCase;
    private final CancelarInscripcionUseCase cancelarInscripcionUseCase;
    private final DesactivarInscripcionesPorParticipanteUseCase desactivarInscripcionesPorParticipanteUseCase;
    private final CerrarSemestreUseCase cerrarSemestreUseCase;
    private final ParticipanteRepository participanteRepository;
    private final RutaRepository rutaRepository;

    @PostMapping
    public ResponseEntity<InscripcionResponse> inscribir(
            @Valid @RequestBody InscribirParticipanteRequest request) {
        Inscripcion inscripcion = inscribirParticipanteUseCase.ejecutar(
                request.getNumeroIdentificacion(),
                request.getRutaId()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(inscripcion));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ENCARGADO')")
    public ResponseEntity<PaginaResponse<InscripcionResponse>> obtenerTodas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<Inscripcion> inscripciones = obtenerInscripcionesUseCase.ejecutar(page, size);
        long total = obtenerInscripcionesUseCase.contarTotal();

        PaginaResponse<InscripcionResponse> respuesta = new PaginaResponse<>(
                inscripciones.stream().map(this::toResponse).collect(Collectors.toList()),
                page,
                (int) Math.ceil((double) total / size),
                total,
                size
        );

        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/participante/{numeroIdentificacion}")
    public ResponseEntity<List<InscripcionResponse>> obtenerPorParticipante(
            @PathVariable String numeroIdentificacion) {
        List<InscripcionResponse> inscripciones = obtenerInscripcionesPorParticipanteUseCase
                .ejecutar(numeroIdentificacion)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(inscripciones);
    }

    @PatchMapping("/{id}/finalizar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> finalizar(@PathVariable Long id) {
        finalizarInscripcionUseCase.ejecutar(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelar(@PathVariable Long id) {
        cancelarInscripcionUseCase.ejecutar(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/participante/{participanteId}/desactivar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> desactivarPorParticipante(@PathVariable Long participanteId) {
        desactivarInscripcionesPorParticipanteUseCase.ejecutar(participanteId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/cerrar-semestre")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> cerrarSemestre() {
        int total = cerrarSemestreUseCase.ejecutar();
        return ResponseEntity.ok(Map.of(
                "mensaje", "Semestre cerrado exitosamente",
                "inscripcionesFinalizadas", total
        ));
    }

    private InscripcionResponse toResponse(Inscripcion inscripcion) {
        String nombreParticipante = participanteRepository
                .findById(inscripcion.getParticipanteId())
                .map(p -> p.getNombreCompleto())
                .orElse("Desconocido");

        String numeroIdentificacion = participanteRepository
                .findById(inscripcion.getParticipanteId())
                .map(p -> p.getNumeroIdentificacion())
                .orElse("—");

        String nombreRuta = rutaRepository
                .findById(inscripcion.getRutaId())
                .map(r -> r.getNombre())
                .orElse("Desconocida");

        return new InscripcionResponse(
                inscripcion.getId(),
                inscripcion.getParticipanteId(),
                nombreParticipante,
                numeroIdentificacion,
                inscripcion.getRutaId(),
                nombreRuta,
                inscripcion.getFechaInscripcion(),
                inscripcion.getEstado()
        );
    }
}