package com.gimnasio.transmoderno.sesiones.domain.exception;

public class SesionNoEncontradaException extends RuntimeException {
    public SesionNoEncontradaException(String identificador) {
        super("Sesión no encontrada: " + identificador);
    }
}