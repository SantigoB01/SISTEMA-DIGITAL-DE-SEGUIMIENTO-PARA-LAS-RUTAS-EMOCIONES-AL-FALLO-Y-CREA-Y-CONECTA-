package com.gimnasio.transmoderno.auth.application;

import com.gimnasio.transmoderno.auth.domain.model.port.UsuarioRepository;
import com.gimnasio.transmoderno.auth.domain.usecase.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AuthUseCaseConfig {

    @Bean
    public LoginUseCase loginUseCase(UsuarioRepository usuarioRepository) {
        return new LoginUseCase(usuarioRepository);
    }

    @Bean
    public RegistrarUsuarioUseCase registrarUsuarioUseCase(UsuarioRepository usuarioRepository) {
        return new RegistrarUsuarioUseCase(usuarioRepository);
    }

    @Bean
    public ObtenerUsuariosUseCase obtenerUsuariosUseCase(UsuarioRepository usuarioRepository) {
        return new ObtenerUsuariosUseCase(usuarioRepository);
    }

    @Bean
    public ActualizarUsuarioUseCase actualizarUsuarioUseCase(UsuarioRepository usuarioRepository) {
        return new ActualizarUsuarioUseCase(usuarioRepository);
    }

    @Bean
    public CambiarContrasenaUseCase cambiarContrasenaUseCase(UsuarioRepository usuarioRepository) {
        return new CambiarContrasenaUseCase(usuarioRepository);
    }

    @Bean
    public DesactivarUsuarioUseCase desactivarUsuarioUseCase(UsuarioRepository usuarioRepository) {
        return new DesactivarUsuarioUseCase(usuarioRepository);
    }
}