package com.gimnasio.transmoderno.participantes.domain.exception;

public class ParticipanteNoEncontradoException extends RuntimeException {
    public ParticipanteNoEncontradoException(String identificador) {
        super("Participante no encontrado: " + identificador);
    }
}