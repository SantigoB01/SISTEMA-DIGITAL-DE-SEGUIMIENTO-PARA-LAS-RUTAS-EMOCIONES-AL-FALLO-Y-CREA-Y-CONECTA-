package com.gimnasio.transmoderno.participantes.domain.exception;

public class ParticipanteYaExisteException extends RuntimeException {
    public ParticipanteYaExisteException(String numeroIdentificacion) {
        super("Ya existe un participante con el número de identificación: " + numeroIdentificacion);
    }
}