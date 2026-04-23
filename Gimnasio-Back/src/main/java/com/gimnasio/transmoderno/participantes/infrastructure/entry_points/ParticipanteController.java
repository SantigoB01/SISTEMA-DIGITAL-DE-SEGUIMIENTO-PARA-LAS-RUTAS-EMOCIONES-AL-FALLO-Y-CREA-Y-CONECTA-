package com.gimnasio.transmoderno.participantes.infrastructure.entry_points;

import com.gimnasio.transmoderno.participantes.domain.model.EstudianteUcundinamarca;
import com.gimnasio.transmoderno.participantes.domain.model.Participante;
import com.gimnasio.transmoderno.participantes.domain.usecase.*;
import com.gimnasio.transmoderno.participantes.infrastructure.entry_points.dto.*;
import com.gimnasio.transmoderno.shared.dto.PaginaResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/participantes")
@RequiredArgsConstructor
public class ParticipanteController {

    private final RegistrarParticipanteUseCase registrarParticipanteUseCase;
    private final ObtenerParticipantesUseCase obtenerParticipantesUseCase;
    private final ObtenerParticipantePorIdentificacionUseCase obtenerParticipantePorIdentificacionUseCase;
    private final ActualizarParticipanteUseCase actualizarParticipanteUseCase;
    private final DesactivarParticipanteUseCase desactivarParticipanteUseCase;
    private final BuscarEstudianteUcundinamarcaUseCase buscarEstudianteUcundinamarcaUseCase;

    @GetMapping("/ucundinamarca/{documento}")
    public ResponseEntity<EstudianteUcundinamarcaResponse> buscarEnUcundinamarca(
            @PathVariable String documento) {
        EstudianteUcundinamarca estudiante = buscarEstudianteUcundinamarcaUseCase.ejecutar(documento);
        return ResponseEntity.ok(toEstudianteResponse(estudiante));
    }

    @PostMapping
    public ResponseEntity<ParticipanteResponse> registrar(
            @Valid @RequestBody RegistrarParticipanteRequest request) {

        Participante participante = Participante.builder()
                .numeroIdentificacion(request.getNumeroIdentificacion())
                .nombreCompleto(request.getNombreCompleto())
                .correoInstitucional(request.getCorreoInstitucional())
                .programaAcademico(request.getProgramaAcademico())
                .semestre(request.getSemestre())
                .tipoDocumento(request.getTipoDocumento())
                .sede(request.getSede())
                .telefono(request.getTelefono())
                .estamento(request.getEstamento())
                .build();

        Participante resultado = registrarParticipanteUseCase.ejecutar(participante);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(resultado));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ENCARGADO')")
    public ResponseEntity<PaginaResponse<ParticipanteResponse>> obtenerTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String nombre) {

        List<Participante> participantes;
        long total;

        if (nombre != null && !nombre.isBlank()) {
            participantes = obtenerParticipantesUseCase.ejecutarPorNombre(nombre, page, size);
            total = obtenerParticipantesUseCase.contarPorNombre(nombre);
        } else {
            participantes = obtenerParticipantesUseCase.ejecutar(page, size);
            total = obtenerParticipantesUseCase.contarTotal();
        }

        PaginaResponse<ParticipanteResponse> respuesta = new PaginaResponse<>(
                participantes.stream().map(this::toResponse).collect(Collectors.toList()),
                page,
                (int) Math.ceil((double) total / size),
                total,
                size
        );

        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/identificacion/{numero}")
    public ResponseEntity<ParticipanteResponse> obtenerPorIdentificacion(
            @PathVariable String numero) {
        Participante participante = obtenerParticipantePorIdentificacionUseCase.ejecutar(numero);
        return ResponseEntity.ok(toResponse(participante));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ParticipanteResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarParticipanteRequest request) {

        Participante participanteActualizado = Participante.builder()
                .numeroIdentificacion(request.getNumeroIdentificacion())
                .nombreCompleto(request.getNombreCompleto())
                .correoInstitucional(request.getCorreoInstitucional())
                .programaAcademico(request.getProgramaAcademico())
                .semestre(request.getSemestre())
                .tipoDocumento(request.getTipoDocumento())
                .sede(request.getSede())
                .telefono(request.getTelefono())
                .estamento(request.getEstamento())
                .build();

        Participante resultado = actualizarParticipanteUseCase.ejecutar(id, participanteActualizado);
        return ResponseEntity.ok(toResponse(resultado));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        desactivarParticipanteUseCase.ejecutar(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/exportar")
    @PreAuthorize("hasAnyRole('ADMIN', 'ENCARGADO')")
    public ResponseEntity<List<ParticipanteResponse>> exportar() {
        List<Participante> participantes = obtenerParticipantesUseCase.ejecutarTodos();
        return ResponseEntity.ok(
                participantes.stream().map(this::toResponse).collect(Collectors.toList())
        );
    }

    @GetMapping("/programas")
    public ResponseEntity<List<String>> obtenerProgramas() {
        return ResponseEntity.ok(buscarEstudianteUcundinamarcaUseCase.obtenerProgramas());
    }

    private ParticipanteResponse toResponse(Participante participante) {
        return new ParticipanteResponse(
                participante.getId(),
                participante.getNumeroIdentificacion(),
                participante.getNombreCompleto(),
                participante.getCorreoInstitucional(),
                participante.getProgramaAcademico(),
                participante.getSemestre(),
                participante.getFechaRegistro(),
                participante.getActivo(),
                participante.getTipoDocumento(),
                participante.getSede(),
                participante.getTelefono(),
                participante.getEstamento()
        );
    }

    private EstudianteUcundinamarcaResponse toEstudianteResponse(EstudianteUcundinamarca e) {
        return new EstudianteUcundinamarcaResponse(
                e.getDocumento(),
                e.getTipoDocumento(),
                e.getNombreCompleto(),
                e.getCorreoInstitucional(),
                e.getSede(),
                e.getPensum()
        );
    }
}