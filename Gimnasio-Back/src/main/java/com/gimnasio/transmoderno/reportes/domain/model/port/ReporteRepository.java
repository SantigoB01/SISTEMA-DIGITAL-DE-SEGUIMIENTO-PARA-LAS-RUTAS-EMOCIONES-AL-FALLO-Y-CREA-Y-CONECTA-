package com.gimnasio.transmoderno.reportes.domain.model.port;

import com.gimnasio.transmoderno.reportes.domain.model.*;

import java.time.LocalDate;
import java.util.List;

public interface ReporteRepository {

    List<ReporteAsistenciaSesion> asistenciaPorSesiones(Long rutaId, LocalDate desde, LocalDate hasta);

    ReporteAsistenciaRuta asistenciaPorRuta(Long rutaId);

    ReporteComparativoRuta comparativoPrePostPorRuta(Long rutaId);

    ReporteAsistenciaPeriodo asistenciaPorPeriodo(Long rutaId, LocalDate desde, LocalDate hasta);

    ReporteComparativoEntreRutas comparativoEntreRutas();

    ReporteGeneral reporteGeneral();
}
