package com.gimnasio.transmoderno.participantes.infrastructure.entry_points.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActualizarParticipanteRequest {

    @NotBlank(message = "El número de identificación es obligatorio")
    private String numeroIdentificacion;

    @NotBlank(message = "El nombre completo es obligatorio")
    private String nombreCompleto;

    @NotBlank(message = "El correo institucional es obligatorio")
    @Email(message = "El correo no tiene un formato válido")
    private String correoInstitucional;

    @NotBlank(message = "El programa académico es obligatorio")
    private String programaAcademico;

    @Min(value = 1, message = "El semestre mínimo es 1")
    @Max(value = 10, message = "El semestre máximo es 10")
    private Integer semestre;

    private String tipoDocumento;
    private String sede;
    private String telefono;
    private String estamento;
}