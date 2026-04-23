package com.gimnasio.transmoderno.inscripciones.domain.exception;

public class ParticipanteYaInscritoException extends RuntimeException {
    public ParticipanteYaInscritoException() {
        super("El participante ya está inscrito en esta ruta");
    }
}