package com.gimnasio.transmoderno.fichas.domain.exception;

public class FichaPreYaExisteException extends RuntimeException {
    public FichaPreYaExisteException() {
        super("Ya existe una ficha PRE para esta inscripción");
    }
}