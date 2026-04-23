package com.gimnasio.transmoderno.fichas.infrastructure.driver_adapters.jpa_repository.ficha_post;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "respuesta_ficha_post")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RespuestaFichaPostData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ficha_post_id", nullable = false)
    private Long fichaPostId;

    @Column(name = "pregunta_id", nullable = false)
    private Long preguntaId;

    @Column(nullable = false)
    private Integer valor;
}