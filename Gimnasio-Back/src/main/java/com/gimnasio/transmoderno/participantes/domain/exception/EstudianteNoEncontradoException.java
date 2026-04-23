package com.gimnasio.transmoderno.participantes.domain.exception;

public class EstudianteNoEncontradoException extends RuntimeException {
    public EstudianteNoEncontradoException(String documento) {
        super("No se encontró ningún estudiante con el documento: " + documento);
    }
}