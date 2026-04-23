package com.gimnasio.transmoderno.fichas.domain.exception;

public class FichaPreNoEncontradaException extends RuntimeException {
    public FichaPreNoEncontradaException(String identificador) {
        super("Ficha PRE no encontrada: " + identificador);
    }
}