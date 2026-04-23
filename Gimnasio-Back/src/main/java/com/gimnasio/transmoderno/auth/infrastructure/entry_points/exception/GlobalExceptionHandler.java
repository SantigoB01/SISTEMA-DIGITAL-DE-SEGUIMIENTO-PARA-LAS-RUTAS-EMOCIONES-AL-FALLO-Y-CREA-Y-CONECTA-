//package com.gimnasio.transmoderno.auth.infrastructure.entry_points.exception;
//
//import com.gimnasio.transmoderno.auth.domain.exception.CredencialesInvalidasException;
//import com.gimnasio.transmoderno.auth.domain.exception.UsuarioNoEncontradoException;
//import com.gimnasio.transmoderno.auth.domain.exception.UsuarioYaExisteException;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.validation.FieldError;
//import org.springframework.web.bind.MethodArgumentNotValidException;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@RestControllerAdvice
//public class GlobalExceptionHandler {
//
//    @ExceptionHandler(CredencialesInvalidasException.class)
//    public ResponseEntity<Map<String, String>> handleCredencialesInvalidas(
//            CredencialesInvalidasException ex) {
//        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                .body(Map.of("mensaje", ex.getMessage()));
//    }
//
//    @ExceptionHandler(UsuarioYaExisteException.class)
//    public ResponseEntity<Map<String, String>> handleUsuarioYaExiste(
//            UsuarioYaExisteException ex) {
//        return ResponseEntity.status(HttpStatus.CONFLICT)
//                .body(Map.of("mensaje", ex.getMessage()));
//    }
//
//    @ExceptionHandler(UsuarioNoEncontradoException.class)
//    public ResponseEntity<Map<String, String>> handleUsuarioNoEncontrado(
//            UsuarioNoEncontradoException ex) {
//        return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                .body(Map.of("mensaje", ex.getMessage()));
//    }
//
//    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
//    public ResponseEntity<Map<String, String>> handleAccessDenied(
//            org.springframework.security.access.AccessDeniedException ex) {
//        return ResponseEntity.status(HttpStatus.FORBIDDEN)
//                .body(Map.of("mensaje", "No tienes permisos para realizar esta acción"));
//    }
//
//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    public ResponseEntity<Map<String, String>> handleValidacion(
//            MethodArgumentNotValidException ex) {
//        Map<String, String> errores = new HashMap<>();
//        ex.getBindingResult().getAllErrors().forEach(error -> {
//            String campo = ((FieldError) error).getField();
//            String mensaje = error.getDefaultMessage();
//            errores.put(campo, mensaje);
//        });
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errores);
//    }
//
//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<Map<String, String>> handleGeneral(Exception ex) {
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                .body(Map.of("mensaje", "Error interno del servidor"));
//    }
//}