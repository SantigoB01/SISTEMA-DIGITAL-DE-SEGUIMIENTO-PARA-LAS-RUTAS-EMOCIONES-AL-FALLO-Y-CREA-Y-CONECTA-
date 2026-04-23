package com.gimnasio.transmoderno.fichas.infrastructure.driver_adapters.jpa_repository.ficha_pre;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "respuesta_ficha_pre")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RespuestaFichaPreData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ficha_pre_id", nullable = false)
    private Long fichaPreId;

    @Column(name = "pregunta_id", nullable = false)
    private Long preguntaId;

    @Column(nullable = false)
    private Integer valor;
}