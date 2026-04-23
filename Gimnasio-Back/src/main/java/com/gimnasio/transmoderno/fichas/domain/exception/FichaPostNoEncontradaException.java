package com.gimnasio.transmoderno.fichas.domain.exception;

public class FichaPostNoEncontradaException extends RuntimeException {
    public FichaPostNoEncontradaException(String identificador) {
        super("Ficha POST no encontrada: " + identificador);
    }
}