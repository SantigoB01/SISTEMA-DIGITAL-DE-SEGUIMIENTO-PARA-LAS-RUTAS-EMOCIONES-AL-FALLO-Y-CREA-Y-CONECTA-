package com.gimnasio.transmoderno.reportes.domain.usecase;

import com.gimnasio.transmoderno.inscripciones.domain.model.EstadoInscripcion;
import com.gimnasio.transmoderno.inscripciones.domain.model.port.InscripcionRepository;
import com.gimnasio.transmoderno.reportes.domain.model.ReporteRetencion;
import com.gimnasio.transmoderno.rutas.domain.model.port.RutaRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public class ObtenerRetencionUseCase {

    private final InscripcionRepository inscripcionRepository;
    private final RutaRepository rutaRepository;

    public List<ReporteRetencion> ejecutar() {
        return rutaRepository.findAll().stream().map(ruta -> {
            long total = inscripcionRepository.countByRutaId(ruta.getId());
            long activos = inscripcionRepository.countByRutaIdAndEstado(ruta.getId(), EstadoInscripcion.ACTIVA);
            long inactivos = total - activos;
            double tasa = total > 0 ? (activos * 100.0 / total) : 0;
            return new ReporteRetencion(ruta.getNombre(), total, activos, inactivos, tasa);
        }).collect(Collectors.toList());
    }
}