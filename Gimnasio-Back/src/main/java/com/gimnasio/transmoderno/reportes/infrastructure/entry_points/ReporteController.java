package com.gimnasio.transmoderno.reportes.infrastructure.entry_points;

import com.gimnasio.transmoderno.reportes.domain.model.ReporteAsistencia;
import com.gimnasio.transmoderno.reportes.domain.model.ReporteFichas;
import com.gimnasio.transmoderno.reportes.domain.model.ReporteParticipantes;
import com.gimnasio.transmoderno.reportes.domain.model.ReporteTendencia;
import com.gimnasio.transmoderno.reportes.domain.usecase.*;
import com.gimnasio.transmoderno.reportes.infrastructure.entry_points.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final ObtenerReporteAsistenciaUseCase obtenerReporteAsistenciaUseCase;
    private final ObtenerReporteParticipantesUseCase obtenerReporteParticipantesUseCase;
    private final ObtenerReporteFichasUseCase obtenerReporteFichasUseCase;
    private final ObtenerRetencionUseCase obtenerRetencionUseCase;

    @GetMapping("/asistencia/ruta")
    @PreAuthorize("hasAnyRole('ADMIN', 'ENCARGADO')")
    public ResponseEntity<List<ReporteAsistenciaResponse>> asistenciaPorRuta(
            @RequestParam(required = false) Long rutaId,
            @RequestParam(required = false) String programaAcademico,
            @RequestParam(required = false) Integer semestre,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {

        return ResponseEntity.ok(
                obtenerReporteAsistenciaUseCase.porRuta(rutaId, programaAcademico, semestre, fechaInicio, fechaFin)
                        .stream()
                        .map(r -> new ReporteAsistenciaResponse(r.getEtiqueta(), r.getTotal()))
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/asistencia/programa")
    @PreAuthorize("hasAnyRole('ADMIN', 'ENCARGADO')")
    public ResponseEntity<List<ReporteAsistenciaResponse>> asistenciaPorPrograma(
            @RequestParam(required = false) Long rutaId,
            @RequestParam(required = false) Integer semestre,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {

        return ResponseEntity.ok(
                obtenerReporteAsistenciaUseCase.porPrograma(rutaId, semestre, fechaInicio, fechaFin)
                        .stream()
                        .map(r -> new ReporteAsistenciaResponse(r.getEtiqueta(), r.getTotal()))
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/asistencia/semestre")
    @PreAuthorize("hasAnyRole('ADMIN', 'ENCARGADO')")
    public ResponseEntity<List<ReporteAsistenciaResponse>> asistenciaPorSemestre(
            @RequestParam(required = false) Long rutaId,
            @RequestParam(required = false) String programaAcademico,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {

        return ResponseEntity.ok(
                obtenerReporteAsistenciaUseCase.porSemestre(rutaId, programaAcademico, fechaInicio, fechaFin)
                        .stream()
                        .map(r -> new ReporteAsistenciaResponse(r.getEtiqueta(), r.getTotal()))
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/asistencia/tendencia")
    @PreAuthorize("hasAnyRole('ADMIN', 'ENCARGADO')")
    public ResponseEntity<List<ReporteTendenciaResponse>> tendenciaSemanal(
            @RequestParam(required = false) Long rutaId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {

        return ResponseEntity.ok(
                obtenerReporteAsistenciaUseCase.tendenciaSemanal(rutaId, fechaInicio, fechaFin)
                        .stream()
                        .map(r -> new ReporteTendenciaResponse(r.getSemana(), r.getTotal()))
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/participantes/programa")
    @PreAuthorize("hasAnyRole('ADMIN', 'ENCARGADO')")
    public ResponseEntity<List<ReporteParticipantesResponse>> participantesPorPrograma(
            @RequestParam(required = false) Long rutaId,
            @RequestParam(required = false) Integer semestre) {

        return ResponseEntity.ok(
                obtenerReporteParticipantesUseCase.porPrograma(rutaId, semestre)
                        .stream()
                        .map(r -> new ReporteParticipantesResponse(r.getEtiqueta(), r.getTotal()))
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/participantes/semestre")
    @PreAuthorize("hasAnyRole('ADMIN', 'ENCARGADO')")
    public ResponseEntity<List<ReporteParticipantesResponse>> participantesPorSemestre(
            @RequestParam(required = false) Long rutaId,
            @RequestParam(required = false) String programaAcademico) {

        return ResponseEntity.ok(
                obtenerReporteParticipantesUseCase.porSemestre(rutaId, programaAcademico)
                        .stream()
                        .map(r -> new ReporteParticipantesResponse(r.getEtiqueta(), r.getTotal()))
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/participantes/ruta")
    @PreAuthorize("hasAnyRole('ADMIN', 'ENCARGADO')")
    public ResponseEntity<List<ReporteParticipantesResponse>> participantesPorRuta() {

        return ResponseEntity.ok(
                obtenerReporteParticipantesUseCase.porRuta()
                        .stream()
                        .map(r -> new ReporteParticipantesResponse(r.getEtiqueta(), r.getTotal()))
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/fichas/comparativa")
    @PreAuthorize("hasAnyRole('ADMIN', 'PSICOLOGO')")
    public ResponseEntity<List<ReporteFichasResponse>> comparativaPrePost(
            @RequestParam(required = false) Long rutaId,
            @RequestParam(required = false) String programaAcademico) {

        return ResponseEntity.ok(
                obtenerReporteFichasUseCase.comparativaPrePost(rutaId, programaAcademico)
                        .stream()
                        .map(r -> new ReporteFichasResponse(
                                r.getPregunta(), r.getPromedioPre(), r.getPromedioPost()))
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/retencion")
    @PreAuthorize("hasAnyRole('ADMIN', 'ENCARGADO')")
    public ResponseEntity<List<ReporteRetencionResponse>> retencion() {
        return ResponseEntity.ok(
                obtenerRetencionUseCase.ejecutar()
                        .stream()
                        .map(r -> new ReporteRetencionResponse(
                                r.getRuta(),
                                r.getTotalInscritos(),
                                r.getActivos(),
                                r.getInactivos(),
                                r.getTasaRetencion()
                        ))
                        .collect(Collectors.toList())
        );
    }
}
