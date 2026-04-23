package com.gimnasio.transmoderno.alertas.domain.exception;

public class SolicitudAyudaNoEncontradaException extends RuntimeException {
    public SolicitudAyudaNoEncontradaException(String identificador) {
        super("Solicitud de ayuda no encontrada: " + identificador);
    }
}