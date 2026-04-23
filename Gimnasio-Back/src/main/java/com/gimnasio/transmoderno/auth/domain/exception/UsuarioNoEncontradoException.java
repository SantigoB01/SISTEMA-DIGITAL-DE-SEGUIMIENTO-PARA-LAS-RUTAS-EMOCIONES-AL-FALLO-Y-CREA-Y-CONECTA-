package com.gimnasio.transmoderno.auth.domain.exception;

public class UsuarioNoEncontradoException extends RuntimeException {
    public UsuarioNoEncontradoException(String identificador) {
        super("Usuario no encontrado: " + identificador);
    }
}