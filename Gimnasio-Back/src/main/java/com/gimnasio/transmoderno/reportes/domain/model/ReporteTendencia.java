package com.gimnasio.transmoderno.reportes.domain.model;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReporteTendencia {
    private LocalDate semana;
    private Long total;
}