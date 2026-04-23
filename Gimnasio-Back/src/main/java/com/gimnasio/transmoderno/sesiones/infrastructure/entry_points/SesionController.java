package com.gimnasio.transmoderno.sesiones.infrastructure.entry_points;

import com.gimnasio.transmoderno.sesiones.domain.model.Sesion;
import com.gimnasio.transmoderno.sesiones.domain.usecase.*;
import com.gimnasio.transmoderno.sesiones.infrastructure.entry_points.dto.*;
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
@RequestMapping("/api/sesiones")
@RequiredArgsConstructor
public class SesionController {

    private final CrearSesionUseCase crearSesionUseCase;
    private final ObtenerSesionesPorRutaUseCase obtenerSesionesPorRutaUseCase;
    private final ObtenerSesionActivaUseCase obtenerSesionActivaUseCase;
    private final EliminarSesionUseCase eliminarSesionUseCase;
    private final ObtenerSesionPorIdUseCase obtenerSesionPorIdUseCase;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ENCARGADO')")
    public ResponseEntity<SesionResponse> crear(
            @Valid @RequestBody CrearSesionRequest request,
            Authentication authentication) {

        Long usuarioId = obtenerUsuarioId(authentication);

        Sesion sesion = Sesion.builder()
                .rutaId(request.getRutaId())
                .creadaPor(usuarioId)
                .nombre(request.getNombre())
                .fecha(request.getFecha())
                .horaInicio(request.getHoraInicio())
                .horaFin(request.getHoraFin())
                .build();

        Sesion resultado = crearSesionUseCase.ejecutar(sesion);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(resultado));
    }

    @GetMapping("/ruta/{rutaId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ENCARGADO')")
    public ResponseEntity<PaginaResponse<SesionResponse>> obtenerPorRuta(
            @PathVariable Long rutaId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<Sesion> sesiones = obtenerSesionesPorRutaUseCase.ejecutar(rutaId, page, size);
        long total = obtenerSesionesPorRutaUseCase.contarTotal(rutaId);

        PaginaResponse<SesionResponse> respuesta = new PaginaResponse<>(
                sesiones.stream().map(this::toResponse).collect(Collectors.toList()),
                page,
                (int) Math.ceil((double) total / size),
                total,
                size
        );

        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/activa/{rutaId}")
    public ResponseEntity<SesionResponse> obtenerSesionActiva(@PathVariable Long rutaId) {
        Sesion sesion = obtenerSesionActivaUseCase.ejecutar(rutaId);
        return ResponseEntity.ok(toResponse(sesion));
    }


    @GetMapping("/{id}")
    public ResponseEntity<SesionResponse> obtenerPorId(@PathVariable Long id) {
        Sesion sesion = obtenerSesionPorIdUseCase.ejecutar(id);
        return ResponseEntity.ok(toResponse(sesion));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ENCARGADO')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        eliminarSesionUseCase.ejecutar(id);
        return ResponseEntity.ok().build();
    }

    private SesionResponse toResponse(Sesion sesion) {
        return new SesionResponse(
                sesion.getId(),
                sesion.getRutaId(),
                sesion.getCreadaPor(),
                sesion.getNombre(),
                sesion.getFecha(),
                sesion.getHoraInicio(),
                sesion.getHoraFin()
        );
    }

    private Long obtenerUsuarioId(Authentication authentication) {
        return (Long) authentication.getDetails();
    }
}