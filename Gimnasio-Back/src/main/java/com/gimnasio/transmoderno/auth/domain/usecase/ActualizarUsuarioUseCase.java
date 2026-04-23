package com.gimnasio.transmoderno.auth.domain.usecase;

import com.gimnasio.transmoderno.auth.domain.exception.UsuarioNoEncontradoException;
import com.gimnasio.transmoderno.auth.domain.exception.UsuarioYaExisteException;
import com.gimnasio.transmoderno.auth.domain.model.Usuario;
import com.gimnasio.transmoderno.auth.domain.model.port.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ActualizarUsuarioUseCase {

    private final UsuarioRepository usuarioRepository;

    public Usuario ejecutar(Long id, Usuario usuarioActualizado) {
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNoEncontradoException(id.toString()));

        if (!usuarioExistente.getCorreo().equals(usuarioActualizado.getCorreo())) {
            usuarioRepository.findByCorreo(usuarioActualizado.getCorreo())
                    .ifPresent(u -> { throw new UsuarioYaExisteException(usuarioActualizado.getCorreo()); });
        }

        usuarioExistente.setNombre(usuarioActualizado.getNombre());
        usuarioExistente.setCorreo(usuarioActualizado.getCorreo());
        usuarioExistente.setRol(usuarioActualizado.getRol());

        return usuarioRepository.save(usuarioExistente);
    }
}