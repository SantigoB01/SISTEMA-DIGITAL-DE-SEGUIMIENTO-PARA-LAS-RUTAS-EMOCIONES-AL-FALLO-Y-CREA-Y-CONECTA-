package com.gimnasio.transmoderno.auth.domain.model.port;

import com.gimnasio.transmoderno.auth.domain.model.Usuario;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository {
    Optional<Usuario> findByCorreo(String correo);
    Usuario save(Usuario usuario);
    Optional<Usuario> findById(Long id);
    List<Usuario> findAll();
}