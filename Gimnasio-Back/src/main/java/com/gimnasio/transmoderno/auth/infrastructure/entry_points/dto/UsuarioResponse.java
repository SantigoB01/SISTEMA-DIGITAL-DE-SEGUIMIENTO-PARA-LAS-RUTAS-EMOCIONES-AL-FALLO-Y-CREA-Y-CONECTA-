package com.gimnasio.transmoderno.auth.infrastructure.entry_points.dto;

import com.gimnasio.transmoderno.auth.domain.model.Rol;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class UsuarioResponse {
    private Long id;
    private String nombre;
    private String correo;
    private Rol rol;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
}