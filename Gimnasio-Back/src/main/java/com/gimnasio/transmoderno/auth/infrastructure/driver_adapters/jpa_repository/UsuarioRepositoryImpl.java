package com.gimnasio.transmoderno.auth.infrastructure.driver_adapters.jpa_repository;

import com.gimnasio.transmoderno.auth.domain.model.Usuario;
import com.gimnasio.transmoderno.auth.domain.model.port.UsuarioRepository;
import com.gimnasio.transmoderno.auth.infrastructure.mapper.UsuarioMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class UsuarioRepositoryImpl implements UsuarioRepository {

    private final UsuarioJpaRepository usuarioJpaRepository;
    private final UsuarioMapper usuarioMapper;

    @Override
    public Optional<Usuario> findByCorreo(String correo) {
        return usuarioJpaRepository.findByCorreo(correo)
                .map(usuarioMapper::toDomain);
    }

    @Override
    public Usuario save(Usuario usuario) {
        UsuarioData data = usuarioMapper.toData(usuario);
        UsuarioData saved = usuarioJpaRepository.save(data);
        return usuarioMapper.toDomain(saved);
    }

    @Override
    public Optional<Usuario> findById(Long id) {
        return usuarioJpaRepository.findById(id)
                .map(usuarioMapper::toDomain);
    }

    @Override
    public List<Usuario> findAll() {
        return usuarioJpaRepository.findAll()
                .stream()
                .map(usuarioMapper::toDomain)
                .collect(Collectors.toList());
    }
}