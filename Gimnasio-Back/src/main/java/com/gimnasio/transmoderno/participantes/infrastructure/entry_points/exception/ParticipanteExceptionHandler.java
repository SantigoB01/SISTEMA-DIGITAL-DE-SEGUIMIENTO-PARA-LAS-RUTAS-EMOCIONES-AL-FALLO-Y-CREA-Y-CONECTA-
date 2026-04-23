//package com.gimnasio.transmoderno.participantes.infrastructure.entry_points.exception;
//
//import com.gimnasio.transmoderno.participantes.domain.exception.ParticipanteNoEncontradoException;
//import com.gimnasio.transmoderno.participantes.domain.exception.ParticipanteYaExisteException;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
//
//import java.util.Map;
//
//@RestControllerAdvice
//public class ParticipanteExceptionHandler {
//
//    @ExceptionHandler(ParticipanteYaExisteException.class)
//    public ResponseEntity<Map<String, String>> handleYaExiste(ParticipanteYaExisteException ex) {
//        return ResponseEntity.status(HttpStatus.CONFLICT)
//                .body(Map.of("mensaje", ex.getMessage()));
//    }
//
//    @ExceptionHandler(ParticipanteNoEncontradoException.class)
//    public ResponseEntity<Map<String, String>> handleNoEncontrado(ParticipanteNoEncontradoException ex) {
//        return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                .body(Map.of("mensaje", ex.getMessage()));
//    }
//}