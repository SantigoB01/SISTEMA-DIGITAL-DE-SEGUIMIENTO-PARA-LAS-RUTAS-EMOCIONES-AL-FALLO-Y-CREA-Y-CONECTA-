package com.gimnasio.transmoderno.auth.domain.model;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {
    private Long id;
    private String nombre;
    private String correo;
    private String contrasena;
    private Rol rol;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
}