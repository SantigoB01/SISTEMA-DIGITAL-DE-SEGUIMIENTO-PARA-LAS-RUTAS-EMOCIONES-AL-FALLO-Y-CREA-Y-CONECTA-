package com.gimnasio.transmoderno.participantes.infrastructure.entry_points.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class EstudianteUcundinamarcaResponse {
    private String documento;
    private String tipoDocumento;
    private String nombreCompleto;
    private String correoInstitucional;
    private String sede;
    private String pensum;
}