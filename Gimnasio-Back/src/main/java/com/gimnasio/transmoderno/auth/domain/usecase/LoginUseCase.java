package com.gimnasio.transmoderno.auth.domain.usecase;

import com.gimnasio.transmoderno.auth.domain.exception.CredencialesInvalidasException;
import com.gimnasio.transmoderno.auth.domain.model.Usuario;
import com.gimnasio.transmoderno.auth.domain.model.port.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class LoginUseCase {

    private final UsuarioRepository usuarioRepository;

    public Usuario ejecutar(String correo) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(CredencialesInvalidasException::new);

        if (!usuario.getActivo()) {
            throw new CredencialesInvalidasException();
        }

        return usuario;
    }
}