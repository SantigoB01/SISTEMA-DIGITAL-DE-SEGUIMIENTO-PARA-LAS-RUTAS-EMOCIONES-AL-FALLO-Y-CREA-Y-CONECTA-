package com.gimnasio.transmoderno.rutas.domain.exception;

public class RutaNoEncontradaException extends RuntimeException {
    public RutaNoEncontradaException(String identificador) {
        super("Ruta no encontrada: " + identificador);
    }
}