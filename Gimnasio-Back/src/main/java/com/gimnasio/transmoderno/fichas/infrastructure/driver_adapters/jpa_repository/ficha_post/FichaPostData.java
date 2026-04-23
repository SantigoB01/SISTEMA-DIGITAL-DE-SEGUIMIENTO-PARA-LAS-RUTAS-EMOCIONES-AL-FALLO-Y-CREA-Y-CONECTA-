package com.gimnasio.transmoderno.fichas.infrastructure.driver_adapters.jpa_repository.ficha_post;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ficha_post")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FichaPostData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ficha_pre_id", nullable = false, unique = true)
    private Long fichaPreId;

    @Column(name = "fecha_diligenciamiento", nullable = false)
    private LocalDateTime fechaDiligenciamiento;

    @Column(nullable = false)
    private Boolean completada;

    @OneToMany(mappedBy = "fichaPostId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RespuestaFichaPostData> respuestas;

    @PrePersist
    public void prePersist() {
        this.fechaDiligenciamiento = LocalDateTime.now();
    }
}