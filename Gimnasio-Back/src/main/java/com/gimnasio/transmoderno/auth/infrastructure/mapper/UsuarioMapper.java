package com.gimnasio.transmoderno.auth.infrastructure.mapper;

import com.gimnasio.transmoderno.auth.domain.model.Usuario;
import com.gimnasio.transmoderno.auth.infrastructure.driver_adapters.jpa_repository.UsuarioData;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public Usuario toDomain(UsuarioData data) {
        return Usuario.builder()
                .id(data.getId())
                .nombre(data.getNombre())
                .correo(data.getCorreo())
                .contrasena(data.getContrasena())
                .rol(data.getRol())
                .activo(data.getActivo())
                .fechaCreacion(data.getFechaCreacion())
                .build();
    }

    public UsuarioData toData(Usuario domain) {
        return UsuarioData.builder()
                .id(domain.getId())
                .nombre(domain.getNombre())
                .correo(domain.getCorreo())
                .contrasena(domain.getContrasena())
                .rol(domain.getRol())
                .activo(domain.getActivo())
                .fechaCreacion(domain.getFechaCreacion())
                .build();
    }
}