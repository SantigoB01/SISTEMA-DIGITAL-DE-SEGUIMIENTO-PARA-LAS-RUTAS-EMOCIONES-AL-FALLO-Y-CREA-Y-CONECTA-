package com.gimnasio.transmoderno.rutas.infrastructure.entry_points;

import com.gimnasio.transmoderno.rutas.domain.model.Ruta;
import com.gimnasio.transmoderno.rutas.domain.usecase.*;
import com.gimnasio.transmoderno.rutas.infrastructure.entry_points.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rutas")
@RequiredArgsConstructor
public class RutaController {

    private final CrearRutaUseCase crearRutaUseCase;
    private final ObtenerRutasUseCase obtenerRutasUseCase;
    private final ObtenerRutaPorIdUseCase obtenerRutaPorIdUseCase;
    private final ActualizarRutaUseCase actualizarRutaUseCase;
    private final DesactivarRutaUseCase desactivarRutaUseCase;
    private final ReactivarRutaUseCase reactivarRutaUseCase;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RutaResponse> crear(@Valid @RequestBody CrearRutaRequest request) {
        Ruta ruta = Ruta.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .build();
        Ruta resultado = crearRutaUseCase.ejecutar(ruta);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(resultado));
    }

    @GetMapping
    public ResponseEntity<List<RutaResponse>> obtenerTodas() {
        List<RutaResponse> rutas = obtenerRutasUseCase.ejecutar()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(rutas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RutaResponse> obtenerPorId(@PathVariable Long id) {
        Ruta ruta = obtenerRutaPorIdUseCase.ejecutar(id);
        return ResponseEntity.ok(toResponse(ruta));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RutaResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarRutaRequest request) {
        Ruta rutaActualizada = Ruta.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .build();
        Ruta resultado = actualizarRutaUseCase.ejecutar(id, rutaActualizada);
        return ResponseEntity.ok(toResponse(resultado));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        desactivarRutaUseCase.ejecutar(id);
        return ResponseEntity.ok().build();
    }

    private RutaResponse toResponse(Ruta ruta) {
        return new RutaResponse(
                ruta.getId(),
                ruta.getNombre(),
                ruta.getDescripcion(),
                ruta.getActiva()
        );
    }

    @PatchMapping("/{id}/reactivar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> reactivar(@PathVariable Long id) {
        reactivarRutaUseCase.ejecutar(id);
        return ResponseEntity.ok().build();
    }
}