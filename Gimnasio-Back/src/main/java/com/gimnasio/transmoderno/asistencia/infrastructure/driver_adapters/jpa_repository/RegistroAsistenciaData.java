package com.gimnasio.transmoderno.asistencia.infrastructure.driver_adapters.jpa_repository;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "registro_asistencia",
        uniqueConstraints = @UniqueConstraint(columnNames = {"participante_id", "sesion_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistroAsistenciaData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "participante_id", nullable = false)
    private Long participanteId;

    @Column(name = "sesion_id", nullable = false)
    private Long sesionId;

    @Column(name = "fecha_hora_registro", nullable = false)
    private LocalDateTime fechaHoraRegistro;

    @PrePersist
    public void prePersist() {
        this.fechaHoraRegistro = LocalDateTime.now();
    }
}