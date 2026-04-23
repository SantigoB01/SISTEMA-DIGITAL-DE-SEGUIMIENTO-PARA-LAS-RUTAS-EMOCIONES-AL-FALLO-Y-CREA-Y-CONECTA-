package com.gimnasio.transmoderno.rutas.domain.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ruta {
    private Long id;
    private String nombre;
    private String descripcion;
    private Boolean activa;
}