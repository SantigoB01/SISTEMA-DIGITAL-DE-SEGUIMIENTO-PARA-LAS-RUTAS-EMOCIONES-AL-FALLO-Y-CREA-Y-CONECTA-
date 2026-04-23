package com.gimnasio.transmoderno.rutas.domain.exception;

public class RutaYaExisteException extends RuntimeException {
    public RutaYaExisteException(String nombre) {
        super("Ya existe una ruta con el nombre: " + nombre);
    }
}