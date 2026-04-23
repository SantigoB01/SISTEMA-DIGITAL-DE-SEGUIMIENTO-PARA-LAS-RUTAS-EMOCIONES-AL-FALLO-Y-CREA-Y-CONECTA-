package com.gimnasio.transmoderno.auth.domain.usecase;

import com.gimnasio.transmoderno.auth.domain.model.Usuario;
import com.gimnasio.transmoderno.auth.domain.model.port.UsuarioRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class ObtenerUsuariosUseCase {

    private final UsuarioRepository usuarioRepository;

    public List<Usuario> ejecutar() {
        return usuarioRepository.findAll();
    }
}