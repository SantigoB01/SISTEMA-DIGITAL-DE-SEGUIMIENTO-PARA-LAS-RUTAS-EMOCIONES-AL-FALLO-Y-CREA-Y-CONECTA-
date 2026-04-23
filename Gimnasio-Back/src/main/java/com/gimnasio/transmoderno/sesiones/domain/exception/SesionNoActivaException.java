package com.gimnasio.transmoderno.sesiones.domain.exception;

public class SesionNoActivaException extends RuntimeException {
    public SesionNoActivaException() {
        super("No hay una sesión activa en este momento para esta ruta");
    }
}