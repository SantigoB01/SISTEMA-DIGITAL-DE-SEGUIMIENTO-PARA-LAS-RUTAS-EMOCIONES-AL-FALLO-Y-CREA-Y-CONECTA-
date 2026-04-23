package com.gimnasio.transmoderno.participantes.domain.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstudianteUcundinamarca {
    private String documento;
    private String tipoDocumento;
    private String primerApellido;
    private String segundoApellido;
    private String primerNombre;
    private String segundoNombre;
    private String nombreCompleto;
    private String modalidad;
    private String correoInstitucional;
    private String sede;
    private String pensum;
}