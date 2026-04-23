package com.gimnasio.transmoderno.reportes.infrastructure.entry_points.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class ReporteTendenciaResponse {
    private LocalDate fecha;
    private Long total;
}