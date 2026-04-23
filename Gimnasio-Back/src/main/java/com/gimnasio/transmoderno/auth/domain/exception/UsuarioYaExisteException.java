package com.gimnasio.transmoderno.auth.domain.exception;

public class UsuarioYaExisteException extends RuntimeException {
    public UsuarioYaExisteException(String correo) {
        super("Ya existe un usuario con el correo: " + correo);
    }
}