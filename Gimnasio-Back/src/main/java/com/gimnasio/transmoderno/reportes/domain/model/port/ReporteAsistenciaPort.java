package com.gimnasio.transmoderno.reportes.domain.model.port;

import com.gimnasio.transmoderno.reportes.domain.model.ReporteAsistencia;
import com.gimnasio.transmoderno.reportes.domain.model.ReporteTendencia;
import java.time.LocalDate;
import java.util.List;

public interface ReporteAsistenciaPort {
    List<ReporteAsistencia> obtenerAsistenciaPorRuta(Long rutaId, String programaAcademico,
                                                     Integer semestre, LocalDate fechaInicio, LocalDate fechaFin);
    List<ReporteAsistencia> obtenerAsistenciaPorPrograma(Long rutaId, Integer semestre,
                                                         LocalDate fechaInicio, LocalDate fechaFin);
    List<ReporteAsistencia> obtenerAsistenciaPorSemestre(Long rutaId, String programaAcademico,
                                                         LocalDate fechaInicio, LocalDate fechaFin);
    List<ReporteTendencia> obtenerTendenciaSemanal(Long rutaId, LocalDate fechaInicio,
                                                   LocalDate fechaFin);
}