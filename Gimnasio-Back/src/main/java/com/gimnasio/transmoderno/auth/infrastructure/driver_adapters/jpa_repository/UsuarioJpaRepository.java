package com.gimnasio.transmoderno.auth.infrastructure.driver_adapters.jpa_repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioJpaRepository extends JpaRepository<UsuarioData, Long> {
    Optional<UsuarioData> findByCorreo(String correo);
}