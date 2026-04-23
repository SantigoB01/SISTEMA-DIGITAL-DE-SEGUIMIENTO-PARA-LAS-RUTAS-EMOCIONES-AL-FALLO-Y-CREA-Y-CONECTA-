package com.gimnasio.transmoderno.inscripciones.domain.exception;

public class InscripcionNoEncontradaException extends RuntimeException {
    public InscripcionNoEncontradaException(String identificador) {
        super("Inscripción no encontrada: " + identificador);
    }
}