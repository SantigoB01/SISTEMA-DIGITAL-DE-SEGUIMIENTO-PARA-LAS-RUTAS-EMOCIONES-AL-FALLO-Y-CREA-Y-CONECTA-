package com.gimnasio.transmoderno.reportes.infrastructure.driver_adapters.jpa_repository;

import com.gimnasio.transmoderno.reportes.domain.model.*;
import com.gimnasio.transmoderno.reportes.domain.model.port.ReporteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class ReporteRepositoryImpl implements ReporteRepository {

    private final ReporteJpaQueries queries;

    @Override
    public List<ReporteAsistenciaSesion> asistenciaPorSesiones(Long rutaId,
                                                                LocalDate desde,
                                                                LocalDate hasta) {
        List<Object[]> sesiones = queries.findSesionesPorRutaYPeriodo(rutaId, desde, hasta);
        long totalInscritos = queries.countInscritosPorRuta(rutaId);

        return sesiones.stream().map(row -> {
            Long sesionId     = (Long)   row[0];
            String nombre     = (String) row[1];
            LocalDate fecha   = (LocalDate) row[2];
            String nombreRuta = (String) row[3];
            long asistentes   = queries.countAsistentesPorSesion(sesionId);
            double pct = totalInscritos > 0
                    ? Math.round((asistentes * 100.0 / totalInscritos) * 10.0) / 10.0
                    : 0.0;
            return ReporteAsistenciaSesion.builder()
                    .sesionId(sesionId)
                    .nombreSesion(nombre)
                    .fecha(fecha)
                    .rutaId(rutaId)
                    .nombreRuta(nombreRuta)
                    .totalAsistentes(asistentes)
                    .totalInscritos(totalInscritos)
                    .porcentajeAsistencia(pct)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    public ReporteAsistenciaRuta asistenciaPorRuta(Long rutaId) {
        Object[] rutaRow = queries.findRutaById(rutaId);
        String nombreRuta   = (String) rutaRow[1];
        long totalSesiones  = queries.countSesionesPorRuta(rutaId);
        long totalInscritos = queries.countInscritosPorRuta(rutaId);
        long totalRegistros = queries.countTotalAsistenciasPorRuta(rutaId);

        double promedio = totalSesiones > 0
                ? Math.round((totalRegistros * 1.0 / totalSesiones) * 10.0) / 10.0
                : 0.0;
        double pctGeneral = (totalSesiones > 0 && totalInscritos > 0)
                ? Math.round((totalRegistros * 100.0 / (totalSesiones * totalInscritos)) * 10.0) / 10.0
                : 0.0;

        return ReporteAsistenciaRuta.builder()
                .rutaId(rutaId)
                .nombreRuta(nombreRuta)
                .totalSesiones(totalSesiones)
                .totalInscritos(totalInscritos)
                .totalRegistrosAsistencia(totalRegistros)
                .promedioAsistenciaPorSesion(promedio)
                .porcentajeAsistenciaGeneral(pctGeneral)
                .build();
    }

    @Override
    public ReporteComparativoRuta comparativoPrePostPorRuta(Long rutaId) {
        Object[] rutaRow = queries.findRutaById(rutaId);
        String nombreRuta = (String) rutaRow[1];

        // Preguntas activas de esta ruta
        List<Object[]> preguntas = queries.findPreguntasActivasPorRuta(rutaId);

        // Participantes que tienen AMBAS fichas completadas en esta ruta
        long totalConAmbas = queries.countParticipantesConAmbasFichas(rutaId);

        List<ReporteComparativoPregunta> porPregunta = new ArrayList<>();
        double sumaPre  = 0;
        double sumaPost = 0;

        for (Object[] pregRow : preguntas) {
            Long preguntaId    = (Long)    pregRow[0];
            String texto       = (String)  pregRow[1];
            Integer orden      = (Integer) pregRow[2];

            Double promPre  = queries.promedioRespuestaPrePorPreguntaYRuta(preguntaId, rutaId);
            Double promPost = queries.promedioRespuestaPostPorPreguntaYRuta(preguntaId, rutaId);

            double pre  = promPre  != null ? Math.round(promPre  * 10.0) / 10.0 : 0.0;
            double post = promPost != null ? Math.round(promPost * 10.0) / 10.0 : 0.0;
            double diff = Math.round((post - pre) * 10.0) / 10.0;

            sumaPre  += pre;
            sumaPost += post;

            porPregunta.add(ReporteComparativoPregunta.builder()
                    .preguntaId(preguntaId)
                    .textoPregunta(texto)
                    .ordenPregunta(orden)
                    .promedioPre(pre)
                    .promedioPost(post)
                    .diferencia(diff)
                    .build());
        }

        int n = preguntas.size();
        double generalPre  = n > 0 ? Math.round((sumaPre  / n) * 10.0) / 10.0 : 0.0;
        double generalPost = n > 0 ? Math.round((sumaPost / n) * 10.0) / 10.0 : 0.0;
        double diffGeneral = Math.round((generalPost - generalPre) * 10.0) / 10.0;

        return ReporteComparativoRuta.builder()
                .rutaId(rutaId)
                .nombreRuta(nombreRuta)
                .totalParticipantesConAmbas(totalConAmbas)
                .promedioGeneralPre(generalPre)
                .promedioGeneralPost(generalPost)
                .diferenciaGeneral(diffGeneral)
                .porPregunta(porPregunta)
                .build();
    }

    @Override
    public ReporteAsistenciaPeriodo asistenciaPorPeriodo(Long rutaId, LocalDate desde, LocalDate hasta) {
        Object[] rutaRow = queries.findRutaById(rutaId);
        String nombreRuta = (String) rutaRow[1];

        List<ReporteAsistenciaSesion> detalle = asistenciaPorSesiones(rutaId, desde, hasta);

        long totalSesiones  = detalle.size();
        long totalInscritos = queries.countInscritosPorRuta(rutaId);
        long totalRegistros = detalle.stream().mapToLong(ReporteAsistenciaSesion::getTotalAsistentes).sum();

        double promedio = totalSesiones > 0
                ? Math.round((totalRegistros * 1.0 / totalSesiones) * 10.0) / 10.0
                : 0.0;
        double pctGeneral = (totalSesiones > 0 && totalInscritos > 0)
                ? Math.round((totalRegistros * 100.0 / (totalSesiones * totalInscritos)) * 10.0) / 10.0
                : 0.0;

        return ReporteAsistenciaPeriodo.builder()
                .rutaId(rutaId)
                .nombreRuta(nombreRuta)
                .desde(desde)
                .hasta(hasta)
                .totalSesionesEnPeriodo(totalSesiones)
                .totalInscritos(totalInscritos)
                .totalRegistrosAsistencia(totalRegistros)
                .promedioAsistenciaPorSesion(promedio)
                .porcentajeAsistenciaGeneral(pctGeneral)
                .detallePorSesion(detalle)
                .build();
    }

    @Override
    public ReporteComparativoEntreRutas comparativoEntreRutas() {
        List<Object[]> rutasActivas = queries.findTodasRutasActivas();

        List<ReporteAsistenciaRuta> asistencia = rutasActivas.stream()
                .map(row -> asistenciaPorRuta((Long) row[0]))
                .collect(Collectors.toList());

        List<ReporteComparativoRuta> bienestar = rutasActivas.stream()
                .map(row -> comparativoPrePostPorRuta((Long) row[0]))
                .collect(Collectors.toList());

        String rutaMayorAsistencia = asistencia.stream()
                .max(Comparator.comparingDouble(ReporteAsistenciaRuta::getPorcentajeAsistenciaGeneral))
                .map(ReporteAsistenciaRuta::getNombreRuta)
                .orElse("N/A");

        String rutaMayorMejora = bienestar.stream()
                .max(Comparator.comparingDouble(ReporteComparativoRuta::getDiferenciaGeneral))
                .map(ReporteComparativoRuta::getNombreRuta)
                .orElse("N/A");

        return ReporteComparativoEntreRutas.builder()
                .totalRutas(rutasActivas.size())
                .asistenciaPorRuta(asistencia)
                .bienestarPorRuta(bienestar)
                .rutaMayorAsistencia(rutaMayorAsistencia)
                .rutaMayorMejoraBienestar(rutaMayorMejora)
                .build();
    }

    @Override
    public ReporteGeneral reporteGeneral() {
        long totalSesiones   = queries.countTotalSesiones();
        long totalAsistencias = queries.countTotalAsistencias();
        long totalInscripciones = queries.countTotalInscripciones();

        double promedioGlobal = (totalSesiones > 0 && totalInscripciones > 0)
                ? Math.round((totalAsistencias * 100.0 / (totalSesiones * totalInscripciones)) * 10.0) / 10.0
                : 0.0;

        long atendidas  = queries.countSolicitudesAtendidas();
        long totalSolic = queries.countTotalSolicitudes();

        return ReporteGeneral.builder()
                .totalParticipantes(queries.countTotalParticipantes())
                .totalParticipantesActivos(queries.countParticipantesActivos())
                .totalRutas(queries.countTotalRutas())
                .totalRutasActivas(queries.countRutasActivas())
                .totalInscripciones(totalInscripciones)
                .totalInscripcionesActivas(queries.countInscripcionesActivas())
                .totalSesiones(totalSesiones)
                .totalRegistrosAsistencia(totalAsistencias)
                .promedioAsistenciaGlobal(promedioGlobal)
                .totalFichasPreCompletadas(queries.countFichasPreCompletadas())
                .totalFichasPostCompletadas(queries.countFichasPostCompletadas())
                .totalParticipantesConCicloCompleto(queries.countCiclosCompletos())
                .totalSolicitudesAyuda(totalSolic)
                .totalSolicitudesAyudaAtendidas(atendidas)
                .totalSolicitudesAyudaPendientes(totalSolic - atendidas)
                .build();
    }
}
