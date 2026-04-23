package com.gimnasio.transmoderno.fichas.domain.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pregunta {
    private Long id;
    private Long rutaId;
    private String texto;
    private Integer orden;
    private Boolean activa;
}