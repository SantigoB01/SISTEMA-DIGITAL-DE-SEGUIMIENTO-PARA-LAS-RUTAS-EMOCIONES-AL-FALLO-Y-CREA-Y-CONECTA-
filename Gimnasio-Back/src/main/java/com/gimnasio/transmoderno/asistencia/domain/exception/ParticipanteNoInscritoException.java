package com.gimnasio.transmoderno.asistencia.domain.exception;

public class ParticipanteNoInscritoException extends RuntimeException {
    public ParticipanteNoInscritoException() {
        super("El participante no está inscrito en la ruta de esta sesión");
    }
}