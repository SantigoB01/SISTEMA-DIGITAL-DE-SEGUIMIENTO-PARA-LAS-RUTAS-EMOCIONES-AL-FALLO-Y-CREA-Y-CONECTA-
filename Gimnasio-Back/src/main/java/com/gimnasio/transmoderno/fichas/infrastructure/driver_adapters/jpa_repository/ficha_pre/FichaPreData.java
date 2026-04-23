package com.gimnasio.transmoderno.fichas.infrastructure.driver_adapters.jpa_repository.ficha_pre;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ficha_pre")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FichaPreData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "inscripcion_id", nullable = false, unique = true)
    private Long inscripcionId;

    @Column(name = "fecha_diligenciamiento", nullable = false)
    private LocalDateTime fechaDiligenciamiento;

    @Column(nullable = false)
    private Boolean completada;

    @OneToMany(mappedBy = "fichaPreId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RespuestaFichaPreData> respuestas;

    @PrePersist
    public void prePersist() {
        this.fechaDiligenciamiento = LocalDateTime.now();
    }
}