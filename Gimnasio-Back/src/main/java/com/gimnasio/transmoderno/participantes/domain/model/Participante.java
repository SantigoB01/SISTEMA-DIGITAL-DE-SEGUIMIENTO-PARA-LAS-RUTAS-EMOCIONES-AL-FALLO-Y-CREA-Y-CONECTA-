package com.gimnasio.transmoderno.participantes.domain.model;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Participante {
    private Long id;
    private String numeroIdentificacion;
    private String nombreCompleto;
    private String correoInstitucional;
    private String programaAcademico;
    private Integer semestre;
    private LocalDateTime fechaRegistro;
    private Boolean activo;
    private String tipoDocumento;
    private String sede;
    private String telefono;
    private String estamento;
}