package com.gimnasio.transmoderno.auth.infrastructure.entry_points;

import com.gimnasio.transmoderno.auth.domain.exception.CredencialesInvalidasException;
import com.gimnasio.transmoderno.auth.domain.model.Rol;
import com.gimnasio.transmoderno.auth.domain.model.Usuario;
import com.gimnasio.transmoderno.auth.domain.usecase.*;
import com.gimnasio.transmoderno.auth.infrastructure.entry_points.dto.*;
import com.gimnasio.transmoderno.auth.infrastructure.security.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final LoginUseCase loginUseCase;
    private final RegistrarUsuarioUseCase registrarUsuarioUseCase;
    private final ObtenerUsuariosUseCase obtenerUsuariosUseCase;
    private final ActualizarUsuarioUseCase actualizarUsuarioUseCase;
    private final CambiarContrasenaUseCase cambiarContrasenaUseCase;
    private final DesactivarUsuarioUseCase desactivarUsuarioUseCase;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        Usuario usuario = loginUseCase.ejecutar(request.getCorreo());

        if (!passwordEncoder.matches(request.getContrasena(), usuario.getContrasena())) {
            throw new CredencialesInvalidasException();
        }

        String token = jwtService.generarToken(usuario.getCorreo(), usuario.getRol().name());

        return ResponseEntity.ok(new LoginResponse(
                token,
                usuario.getNombre(),
                usuario.getCorreo()
        ));
    }

    @PostMapping("/registro")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> registrar(@Valid @RequestBody RegistroRequest request) {
        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .correo(request.getCorreo())
                .contrasena(passwordEncoder.encode(request.getContrasena()))
                .rol(request.getRol())
                .build();

        registrarUsuarioUseCase.ejecutar(usuario);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/usuarios")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioResponse>> obtenerUsuarios() {
        List<UsuarioResponse> usuarios = obtenerUsuariosUseCase.ejecutar()
                .stream()
                .map(u -> new UsuarioResponse(
                        u.getId(),
                        u.getNombre(),
                        u.getCorreo(),
                        u.getRol(),
                        u.getActivo(),
                        u.getFechaCreacion()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(usuarios);
    }

    @PutMapping("/usuarios/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarUsuarioRequest request) {

        Usuario usuarioActualizado = Usuario.builder()
                .nombre(request.getNombre())
                .correo(request.getCorreo())
                .rol(request.getRol())
                .build();

        Usuario resultado = actualizarUsuarioUseCase.ejecutar(id, usuarioActualizado);

        return ResponseEntity.ok(new UsuarioResponse(
                resultado.getId(),
                resultado.getNombre(),
                resultado.getCorreo(),
                resultado.getRol(),
                resultado.getActivo(),
                resultado.getFechaCreacion()
        ));
    }

    @PatchMapping("/usuarios/{id}/contrasena")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> cambiarContrasena(
            @PathVariable Long id,
            @Valid @RequestBody CambiarContrasenaRequest request) {

        cambiarContrasenaUseCase.ejecutar(id, passwordEncoder.encode(request.getContrasena()));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/usuarios/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        desactivarUsuarioUseCase.ejecutar(id);
        return ResponseEntity.ok().build();
    }
}