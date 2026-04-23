package com.gimnasio.transmoderno.fichas.domain.exception;

public class FichaPostYaExisteException extends RuntimeException {
    public FichaPostYaExisteException() {
        super("Ya existe una ficha POST para esta ficha PRE");
    }
}