package com.gimnasio.transmoderno.fichas.domain.exception;

public class FichaPreNoCompletadaException extends RuntimeException {
    public FichaPreNoCompletadaException() {
        super("La ficha PRE no está completada, no se puede crear la ficha POST");
    }
}