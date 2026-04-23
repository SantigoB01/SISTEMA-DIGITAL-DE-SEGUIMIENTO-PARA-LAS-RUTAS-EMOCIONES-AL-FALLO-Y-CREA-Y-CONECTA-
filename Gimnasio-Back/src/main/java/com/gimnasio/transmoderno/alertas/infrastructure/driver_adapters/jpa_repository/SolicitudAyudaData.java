package com.gimnasio.transmoderno.alertas.infrastructure.driver_adapters.jpa_repository;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitud_ayuda")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SolicitudAyudaData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "participante_id", nullable = false)
    private Long participanteId;

    @Column(name = "atendida_por")
    private Long atendidaPor;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;

    @Column(nullable = false)
    private Boolean atendida;

    @Column(name = "fecha_atencion")
    private LocalDateTime fechaAtencion;

    @PrePersist
    public void prePersist() {
        this.fechaHora = LocalDateTime.now();
        this.atendida = false;
    }
}