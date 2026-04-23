package com.gimnasio.transmoderno.fichas.domain.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RespuestaFicha {
    private Long id;
    private Long preguntaId;
    private Integer valor;
}