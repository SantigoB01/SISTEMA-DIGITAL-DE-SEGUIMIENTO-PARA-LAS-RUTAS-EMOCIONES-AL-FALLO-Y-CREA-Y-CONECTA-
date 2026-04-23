package com.gimnasio.transmoderno.rutas.infrastructure.entry_points.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RutaResponse {
    private Long id;
    private String nombre;
    private String descripcion;
    private Boolean activa;
}