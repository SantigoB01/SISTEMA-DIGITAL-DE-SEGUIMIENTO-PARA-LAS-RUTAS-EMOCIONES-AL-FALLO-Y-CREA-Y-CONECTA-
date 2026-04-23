package com.gimnasio.transmoderno.auth.domain.usecase;

import com.gimnasio.transmoderno.auth.domain.exception.UsuarioNoEncontradoException;
import com.gimnasio.transmoderno.auth.domain.model.Usuario;
import com.gimnasio.transmoderno.auth.domain.model.port.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CambiarContrasenaUseCase {

    private final UsuarioRepository usuarioRepository;

    public void ejecutar(Long id, String nuevaContrasena) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNoEncontradoException(id.toString()));

        usuario.setContrasena(nuevaContrasena);
        usuarioRepository.save(usuario);
    }
}