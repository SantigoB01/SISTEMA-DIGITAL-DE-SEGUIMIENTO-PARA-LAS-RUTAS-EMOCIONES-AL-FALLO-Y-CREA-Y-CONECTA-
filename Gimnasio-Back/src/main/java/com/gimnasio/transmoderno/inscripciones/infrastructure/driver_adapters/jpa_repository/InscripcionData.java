package com.gimnasio.transmoderno.inscripciones.infrastructure.driver_adapters.jpa_repository;

import com.gimnasio.transmoderno.inscripciones.domain.model.EstadoInscripcion;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inscripciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InscripcionData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "participante_id", nullable = false)
    private Long participanteId;

    @Column(name = "ruta_id", nullable = false)
    private Long rutaId;

    @Column(name = "fecha_inscripcion", nullable = false)
    private LocalDateTime fechaInscripcion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoInscripcion estado;

    @PrePersist
    public void prePersist() {
        this.fechaInscripcion = LocalDateTime.now();
        this.estado = EstadoInscripcion.ACTIVA;
    }
}