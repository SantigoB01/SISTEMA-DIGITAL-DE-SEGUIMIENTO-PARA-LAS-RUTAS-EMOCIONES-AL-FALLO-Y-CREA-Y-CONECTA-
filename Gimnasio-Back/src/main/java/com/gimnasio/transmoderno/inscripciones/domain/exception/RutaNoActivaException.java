package com.gimnasio.transmoderno.inscripciones.domain.exception;

public class RutaNoActivaException extends RuntimeException {
    public RutaNoActivaException() {
        super("La ruta no está activa");
    }
}