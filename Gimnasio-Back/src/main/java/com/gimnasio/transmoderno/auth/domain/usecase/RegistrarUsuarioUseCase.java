package com.gimnasio.transmoderno.auth.domain.usecase;

import com.gimnasio.transmoderno.auth.domain.exception.UsuarioYaExisteException;
import com.gimnasio.transmoderno.auth.domain.model.Usuario;
import com.gimnasio.transmoderno.auth.domain.model.port.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class RegistrarUsuarioUseCase {

    private final UsuarioRepository usuarioRepository;

    public Usuario ejecutar(Usuario usuario) {
        usuarioRepository.findByCorreo(usuario.getCorreo())
                .ifPresent(u -> { throw new UsuarioYaExisteException(usuario.getCorreo()); });

        return usuarioRepository.save(usuario);
    }
}