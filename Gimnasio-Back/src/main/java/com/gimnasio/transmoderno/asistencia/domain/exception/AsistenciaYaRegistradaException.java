package com.gimnasio.transmoderno.asistencia.domain.exception;

public class AsistenciaYaRegistradaException extends RuntimeException {
  public AsistenciaYaRegistradaException() {
    super("Ya registraste asistencia en esta sesión");
  }
}