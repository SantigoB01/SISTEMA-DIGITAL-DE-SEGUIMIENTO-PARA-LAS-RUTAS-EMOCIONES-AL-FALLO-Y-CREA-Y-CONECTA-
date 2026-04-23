package com.gimnasio.transmoderno.fichas.domain.exception;

public class PreguntaNoEncontradaException extends RuntimeException {
    public PreguntaNoEncontradaException(String identificador) {
        super("Pregunta no encontrada: " + identificador);
    }
}