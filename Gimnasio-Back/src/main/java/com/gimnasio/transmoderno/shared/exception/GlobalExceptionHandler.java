package com.gimnasio.transmoderno.shared.exception;

import com.gimnasio.transmoderno.alertas.domain.exception.SolicitudAyudaNoEncontradaException;
import com.gimnasio.transmoderno.asistencia.domain.exception.AsistenciaYaRegistradaException;
import com.gimnasio.transmoderno.asistencia.domain.exception.ParticipanteNoInscritoException;
import com.gimnasio.transmoderno.auth.domain.exception.CredencialesInvalidasException;
import com.gimnasio.transmoderno.auth.domain.exception.UsuarioNoEncontradoException;
import com.gimnasio.transmoderno.auth.domain.exception.UsuarioYaExisteException;
import com.gimnasio.transmoderno.inscripciones.domain.exception.InscripcionNoEncontradaException;
import com.gimnasio.transmoderno.inscripciones.domain.exception.ParticipanteYaInscritoException;
import com.gimnasio.transmoderno.inscripciones.domain.exception.RutaNoActivaException;
import com.gimnasio.transmoderno.participantes.domain.exception.ParticipanteNoEncontradoException;
import com.gimnasio.transmoderno.participantes.domain.exception.ParticipanteYaExisteException;
import com.gimnasio.transmoderno.rutas.domain.exception.RutaNoEncontradaException;
import com.gimnasio.transmoderno.rutas.domain.exception.RutaYaExisteException;
import com.gimnasio.transmoderno.sesiones.domain.exception.SesionNoActivaException;
import com.gimnasio.transmoderno.sesiones.domain.exception.SesionNoEncontradaException;
import com.gimnasio.transmoderno.fichas.domain.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    //USUARIOS

    @ExceptionHandler(CredencialesInvalidasException.class)
    public ResponseEntity<Map<String, String>> handleCredencialesInvalidas(
            CredencialesInvalidasException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("mensaje", ex.getMessage()));
    }

    @ExceptionHandler(UsuarioYaExisteException.class)
    public ResponseEntity<Map<String, String>> handleUsuarioYaExiste(
            UsuarioYaExisteException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("mensaje", ex.getMessage()));
    }

    @ExceptionHandler(UsuarioNoEncontradoException.class)
    public ResponseEntity<Map<String, String>> handleUsuarioNoEncontrado(
            UsuarioNoEncontradoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("mensaje", ex.getMessage()));
    }

    //PARTICIPANTES

    @ExceptionHandler(ParticipanteYaExisteException.class)
    public ResponseEntity<Map<String, String>> handleParticipanteYaExiste(
            ParticipanteYaExisteException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("mensaje", ex.getMessage()));
    }

    @ExceptionHandler(ParticipanteNoEncontradoException.class)
    public ResponseEntity<Map<String, String>> handleParticipanteNoEncontrado(
            ParticipanteNoEncontradoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("mensaje", ex.getMessage()));
    }

    //RUTAS


    @ExceptionHandler(RutaNoEncontradaException.class)
    public ResponseEntity<Map<String, String>> handleRutaNoEncontrada(
            RutaNoEncontradaException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("mensaje", ex.getMessage()));
    }

    @ExceptionHandler(RutaYaExisteException.class)
    public ResponseEntity<Map<String, String>> handleRutaYaExiste(
            RutaYaExisteException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("mensaje", ex.getMessage()));
    }

    //INSCRIPCIONES

    @ExceptionHandler(InscripcionNoEncontradaException.class)
    public ResponseEntity<Map<String, String>> handleInscripcionNoEncontrada(
            InscripcionNoEncontradaException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("mensaje", ex.getMessage()));
    }

    @ExceptionHandler(ParticipanteYaInscritoException.class)
    public ResponseEntity<Map<String, String>> handleParticipanteYaInscrito(
            ParticipanteYaInscritoException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("mensaje", ex.getMessage()));
    }

    @ExceptionHandler(RutaNoActivaException.class)
    public ResponseEntity<Map<String, String>> handleRutaNoActiva(
            RutaNoActivaException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("mensaje", ex.getMessage()));
    }

    //SESIONES

    @ExceptionHandler(SesionNoEncontradaException.class)
    public ResponseEntity<Map<String, String>> handleSesionNoEncontrada(
            SesionNoEncontradaException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("mensaje", ex.getMessage()));
    }

    @ExceptionHandler(SesionNoActivaException.class)
    public ResponseEntity<Map<String, String>> handleSesionNoActiva(
            SesionNoActivaException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("mensaje", ex.getMessage()));
    }

    // ASISTENCIA

    @ExceptionHandler(AsistenciaYaRegistradaException.class)
    public ResponseEntity<Map<String, String>> handleAsistenciaYaRegistrada(
            AsistenciaYaRegistradaException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("mensaje", ex.getMessage()));
    }

    @ExceptionHandler(ParticipanteNoInscritoException.class)
    public ResponseEntity<Map<String, String>> handleParticipanteNoInscrito(
            ParticipanteNoInscritoException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("mensaje", ex.getMessage()));
    }

    // FICHAS

    @ExceptionHandler(PreguntaNoEncontradaException.class)
    public ResponseEntity<Map<String, String>> handlePreguntaNoEncontrada(
            PreguntaNoEncontradaException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("mensaje", ex.getMessage()));
    }

    @ExceptionHandler(FichaPreNoEncontradaException.class)
    public ResponseEntity<Map<String, String>> handleFichaPreNoEncontrada(
            FichaPreNoEncontradaException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("mensaje", ex.getMessage()));
    }

    @ExceptionHandler(FichaPostNoEncontradaException.class)
    public ResponseEntity<Map<String, String>> handleFichaPostNoEncontrada(
            FichaPostNoEncontradaException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("mensaje", ex.getMessage()));
    }

    @ExceptionHandler(FichaPreYaExisteException.class)
    public ResponseEntity<Map<String, String>> handleFichaPreYaExiste(
            FichaPreYaExisteException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("mensaje", ex.getMessage()));
    }

    @ExceptionHandler(FichaPostYaExisteException.class)
    public ResponseEntity<Map<String, String>> handleFichaPostYaExiste(
            FichaPostYaExisteException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("mensaje", ex.getMessage()));
    }

    @ExceptionHandler(FichaPreNoCompletadaException.class)
    public ResponseEntity<Map<String, String>> handleFichaPreNoCompletada(
            FichaPreNoCompletadaException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("mensaje", ex.getMessage()));
    }

    //ALERTAS

    @ExceptionHandler(SolicitudAyudaNoEncontradaException.class)
    public ResponseEntity<Map<String, String>> handleSolicitudAyudaNoEncontrada(
            SolicitudAyudaNoEncontradaException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("mensaje", ex.getMessage()));
    }

    //OTRAS

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidacion(
            MethodArgumentNotValidException ex) {
        Map<String, String> errores = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String campo = ((FieldError) error).getField();
            String mensaje = error.getDefaultMessage();
            errores.put(campo, mensaje);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errores);
    }

    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDenied(
            org.springframework.security.access.AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("mensaje", "No tienes permisos para realizar esta acción"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneral(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("mensaje", "Error interno del servidor"));
    }
}