package com.gimnasio.transmoderno.reportes.infrastructure.driver_adapters.jpa_repository;

import com.gimnasio.transmoderno.sesiones.infrastructure.driver_adapters.jpa_repository.SesionData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReporteJpaQueries extends JpaRepository<SesionData, Long> {

    // ── Rutas ─────────────────────────────────────────────────────────────────

    @Query("""
            SELECT r.id, r.nombre
            FROM RutaData r
            WHERE r.id = :rutaId
            """)
    Object[] findRutaById(@Param("rutaId") Long rutaId);

    // ── Sesiones ──────────────────────────────────────────────────────────────

    @Query("""
            SELECT s.id, s.nombre, s.fecha, r.nombre
            FROM SesionData s
            JOIN RutaData r ON r.id = s.rutaId
            WHERE s.rutaId = :rutaId
              AND (:desde IS NULL OR s.fecha >= :desde)
              AND (:hasta IS NULL OR s.fecha <= :hasta)
            ORDER BY s.fecha ASC
            """)
    List<Object[]> findSesionesPorRutaYPeriodo(@Param("rutaId") Long rutaId,
                                               @Param("desde") LocalDate desde,
                                               @Param("hasta") LocalDate hasta);

    @Query("""
            SELECT COUNT(s)
            FROM SesionData s
            WHERE s.rutaId = :rutaId
            """)
    long countSesionesPorRuta(@Param("rutaId") Long rutaId);

    // ── Asistencia ────────────────────────────────────────────────────────────

    @Query("""
            SELECT COUNT(ra)
            FROM RegistroAsistenciaData ra
            WHERE ra.sesionId = :sesionId
            """)
    long countAsistentesPorSesion(@Param("sesionId") Long sesionId);

    @Query("""
            SELECT COUNT(ra)
            FROM RegistroAsistenciaData ra
            JOIN SesionData s ON s.id = ra.sesionId
            WHERE s.rutaId = :rutaId
            """)
    long countTotalAsistenciasPorRuta(@Param("rutaId") Long rutaId);

    // ── Inscripciones ─────────────────────────────────────────────────────────

    @Query("""
            SELECT COUNT(i)
            FROM InscripcionData i
            WHERE i.rutaId = :rutaId
              AND i.estado = com.gimnasio.transmoderno.inscripciones.domain.model.EstadoInscripcion.ACTIVA
            """)
    long countInscritosPorRuta(@Param("rutaId") Long rutaId);

    // ── Preguntas ─────────────────────────────────────────────────────────────

    @Query("""
            SELECT p.id, p.texto, p.orden
            FROM PreguntaData p
            WHERE p.rutaId = :rutaId
              AND p.activa = true
            ORDER BY p.orden ASC
            """)
    List<Object[]> findPreguntasActivasPorRuta(@Param("rutaId") Long rutaId);

    // ── Comparativo PRE / POST ────────────────────────────────────────────────

    @Query("""
            SELECT COUNT(DISTINCT fp.id)
            FROM FichaPreData fp
            JOIN InscripcionData i ON i.id = fp.inscripcionId
            JOIN FichaPostData fpost ON fpost.fichaPreId = fp.id
            WHERE i.rutaId = :rutaId
              AND fp.completada = true
              AND fpost.completada = true
            """)
    long countParticipantesConAmbasFichas(@Param("rutaId") Long rutaId);

    @Query("""
            SELECT AVG(CAST(r.valor AS double))
            FROM RespuestaFichaPreData r
            JOIN FichaPreData fp ON fp.id = r.fichaPreId
            JOIN InscripcionData i ON i.id = fp.inscripcionId
            WHERE r.preguntaId = :preguntaId
              AND i.rutaId = :rutaId
              AND fp.completada = true
            """)
    Double promedioRespuestaPrePorPreguntaYRuta(@Param("preguntaId") Long preguntaId,
                                                @Param("rutaId") Long rutaId);

    @Query("""
            SELECT AVG(CAST(r.valor AS double))
            FROM RespuestaFichaPostData r
            JOIN FichaPostData fpost ON fpost.id = r.fichaPostId
            JOIN FichaPreData fp ON fp.id = fpost.fichaPreId
            JOIN InscripcionData i ON i.id = fp.inscripcionId
            WHERE r.preguntaId = :preguntaId
              AND i.rutaId = :rutaId
              AND fpost.completada = true
            """)
    Double promedioRespuestaPostPorPreguntaYRuta(@Param("preguntaId") Long preguntaId,
                                                 @Param("rutaId") Long rutaId);

    // ── Queries para comparativo entre rutas ──────────────────────────────────

    @Query("""
            SELECT r.id, r.nombre
            FROM RutaData r
            WHERE r.activa = true
            ORDER BY r.id ASC
            """)
    List<Object[]> findTodasRutasActivas();

    // ── Queries para reporte general ──────────────────────────────────────────

    @Query("SELECT COUNT(p) FROM ParticipanteData p")
    long countTotalParticipantes();

    @Query("SELECT COUNT(p) FROM ParticipanteData p WHERE p.activo = true")
    long countParticipantesActivos();

    @Query("SELECT COUNT(r) FROM RutaData r")
    long countTotalRutas();

    @Query("SELECT COUNT(r) FROM RutaData r WHERE r.activa = true")
    long countRutasActivas();

    @Query("SELECT COUNT(i) FROM InscripcionData i")
    long countTotalInscripciones();

    @Query("""
            SELECT COUNT(i) FROM InscripcionData i
            WHERE i.estado = com.gimnasio.transmoderno.inscripciones.domain.model.EstadoInscripcion.ACTIVA
            """)
    long countInscripcionesActivas();

    @Query("SELECT COUNT(s) FROM SesionData s")
    long countTotalSesiones();

    @Query("SELECT COUNT(ra) FROM RegistroAsistenciaData ra")
    long countTotalAsistencias();

    @Query("SELECT COUNT(fp) FROM FichaPreData fp WHERE fp.completada = true")
    long countFichasPreCompletadas();

    @Query("SELECT COUNT(fpost) FROM FichaPostData fpost WHERE fpost.completada = true")
    long countFichasPostCompletadas();

    @Query("""
            SELECT COUNT(DISTINCT fp.id)
            FROM FichaPreData fp
            JOIN FichaPostData fpost ON fpost.fichaPreId = fp.id
            WHERE fp.completada = true AND fpost.completada = true
            """)
    long countCiclosCompletos();

    @Query("SELECT COUNT(sa) FROM SolicitudAyudaData sa")
    long countTotalSolicitudes();

    @Query("SELECT COUNT(sa) FROM SolicitudAyudaData sa WHERE sa.atendida = true")
    long countSolicitudesAtendidas();
}
