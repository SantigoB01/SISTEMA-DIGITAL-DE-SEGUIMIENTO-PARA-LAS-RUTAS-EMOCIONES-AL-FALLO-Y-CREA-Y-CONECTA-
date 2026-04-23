package com.gimnasio.transmoderno.fichas.infrastructure.entry_points;

import com.gimnasio.transmoderno.fichas.domain.model.FichaPre;
import com.gimnasio.transmoderno.fichas.domain.model.FichaPost;
import com.gimnasio.transmoderno.fichas.domain.model.RespuestaFicha;
import com.gimnasio.transmoderno.fichas.domain.usecase.*;
import com.gimnasio.transmoderno.fichas.infrastructure.entry_points.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/fichas")
@RequiredArgsConstructor
public class FichaController {

    private final CrearFichaPreUseCase crearFichaPreUseCase;
    private final ObtenerFichaPreUseCase obtenerFichaPreUseCase;
    private final CrearFichaPostUseCase crearFichaPostUseCase;
    private final ObtenerFichaPostUseCase obtenerFichaPostUseCase;

    @PostMapping("/pre")
    public ResponseEntity<FichaPreResponse> crearPre(
            @Valid @RequestBody CrearFichaPreRequest request) {

        List<RespuestaFicha> respuestas = request.getRespuestas().stream()
                .map(r -> RespuestaFicha.builder()
                        .preguntaId(r.getPreguntaId())
                        .valor(r.getValor())
                        .build())
                .collect(Collectors.toList());

        FichaPre fichaPre = FichaPre.builder()
                .inscripcionId(request.getInscripcionId())
                .respuestas(respuestas)
                .build();

        FichaPre resultado = crearFichaPreUseCase.ejecutar(fichaPre);
        return ResponseEntity.status(HttpStatus.CREATED).body(toPreResponse(resultado));
    }

    @GetMapping("/pre/inscripcion/{inscripcionId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PSICOLOGO')")
    public ResponseEntity<FichaPreResponse> obtenerPre(@PathVariable Long inscripcionId) {
        FichaPre fichaPre = obtenerFichaPreUseCase.ejecutar(inscripcionId);
        return ResponseEntity.ok(toPreResponse(fichaPre));
    }

    @PostMapping("/post")
    public ResponseEntity<FichaPostResponse> crearPost(
            @Valid @RequestBody CrearFichaPostRequest request) {

        List<RespuestaFicha> respuestas = request.getRespuestas().stream()
                .map(r -> RespuestaFicha.builder()
                        .preguntaId(r.getPreguntaId())
                        .valor(r.getValor())
                        .build())
                .collect(Collectors.toList());

        FichaPost fichaPost = FichaPost.builder()
                .fichaPreId(request.getFichaPreId())
                .respuestas(respuestas)
                .build();

        FichaPost resultado = crearFichaPostUseCase.ejecutar(fichaPost);
        return ResponseEntity.status(HttpStatus.CREATED).body(toPostResponse(resultado));
    }

    @GetMapping("/post/inscripcion/{fichaPreId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PSICOLOGO')")
    public ResponseEntity<FichaPostResponse> obtenerPost(@PathVariable Long fichaPreId) {
        FichaPost fichaPost = obtenerFichaPostUseCase.ejecutar(fichaPreId);
        return ResponseEntity.ok(toPostResponse(fichaPost));
    }

    private FichaPreResponse toPreResponse(FichaPre fichaPre) {
        List<RespuestaFichaResponse> respuestas = fichaPre.getRespuestas().stream()
                .map(r -> new RespuestaFichaResponse(r.getId(), r.getPreguntaId(), r.getValor()))
                .collect(Collectors.toList());
        return new FichaPreResponse(
                fichaPre.getId(),
                fichaPre.getInscripcionId(),
                fichaPre.getFechaDiligenciamiento(),
                fichaPre.getCompletada(),
                respuestas
        );
    }

    private FichaPostResponse toPostResponse(FichaPost fichaPost) {
        List<RespuestaFichaResponse> respuestas = fichaPost.getRespuestas().stream()
                .map(r -> new RespuestaFichaResponse(r.getId(), r.getPreguntaId(), r.getValor()))
                .collect(Collectors.toList());
        return new FichaPostResponse(
                fichaPost.getId(),
                fichaPost.getFichaPreId(),
                fichaPost.getFechaDiligenciamiento(),
                fichaPost.getCompletada(),
                respuestas
        );
    }
}