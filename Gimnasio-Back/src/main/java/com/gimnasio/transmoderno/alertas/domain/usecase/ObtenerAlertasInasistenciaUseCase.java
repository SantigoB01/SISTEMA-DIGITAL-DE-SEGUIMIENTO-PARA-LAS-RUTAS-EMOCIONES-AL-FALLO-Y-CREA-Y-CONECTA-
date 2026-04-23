package com.gimnasio.transmoderno.alertas.domain.usecase;

import com.gimnasio.transmoderno.alertas.domain.model.AlertaInasistencia;
import com.gimnasio.transmoderno.alertas.domain.model.port.AlertaInasistenciaPort;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class ObtenerAlertasInasistenciaUseCase {

    private final AlertaInasistenciaPort alertaInasistenciaPort;

    public List<AlertaInasistencia> ejecutar() {
        return alertaInasistenciaPort.obtenerParticipantesSinAsistir(7);
    }
}