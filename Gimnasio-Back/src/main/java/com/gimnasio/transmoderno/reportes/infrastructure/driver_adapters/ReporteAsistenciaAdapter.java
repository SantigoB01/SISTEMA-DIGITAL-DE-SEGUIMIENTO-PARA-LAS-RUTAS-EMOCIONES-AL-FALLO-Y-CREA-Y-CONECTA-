package com.gimnasio.transmoderno.reportes.infrastructure.driver_adapters;

import com.gimnasio.transmoderno.reportes.domain.model.ReporteAsistencia;
import com.gimnasio.transmoderno.reportes.domain.model.ReporteTendencia;
import com.gimnasio.transmoderno.reportes.domain.model.port.ReporteAsistenciaPort;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ReporteAsistenciaAdapter implements ReporteAsistenciaPort {

    private final EntityManager entityManager;

    @Override
    public List<ReporteAsistencia> obtenerAsistenciaPorRuta(Long rutaId,
                                                            String programaAcademico, Integer semestre,
                                                            LocalDate fechaInicio, LocalDate fechaFin) {

        StringBuilder jpql = new StringBuilder("""
                SELECT r.nombre, COUNT(a.id)
                FROM RegistroAsistenciaData a
                JOIN SesionData s ON s.id = a.sesionId
                JOIN RutaData r ON r.id = s.rutaId
                JOIN ParticipanteData p ON p.id = a.participanteId
                WHERE 1=1
                """);

        if (rutaId != null) jpql.append(" AND r.id = :rutaId");
        if (programaAcademico != null) jpql.append(" AND p.programaAcademico = :programaAcademico");
        if (semestre != null) jpql.append(" AND p.semestre = :semestre");
        if (fechaInicio != null) jpql.append(" AND s.fecha >= :fechaInicio");
        if (fechaFin != null) jpql.append(" AND s.fecha <= :fechaFin");
        jpql.append(" GROUP BY r.nombre ORDER BY r.nombre");

        var query = entityManager.createQuery(jpql.toString());
        if (rutaId != null) query.setParameter("rutaId", rutaId);
        if (programaAcademico != null) query.setParameter("programaAcademico", programaAcademico);
        if (semestre != null) query.setParameter("semestre", semestre);
        if (fechaInicio != null) query.setParameter("fechaInicio", fechaInicio);
        if (fechaFin != null) query.setParameter("fechaFin", fechaFin);

        List<Object[]> resultados = query.getResultList();
        List<ReporteAsistencia> reportes = new ArrayList<>();
        for (Object[] row : resultados) {
            reportes.add(new ReporteAsistencia((String) row[0], (Long) row[1]));
        }
        return reportes;
    }

    @Override
    public List<ReporteAsistencia> obtenerAsistenciaPorPrograma(Long rutaId,
                                                                Integer semestre, LocalDate fechaInicio, LocalDate fechaFin) {

        StringBuilder jpql = new StringBuilder("""
                SELECT p.programaAcademico, COUNT(a.id)
                FROM RegistroAsistenciaData a
                JOIN SesionData s ON s.id = a.sesionId
                JOIN ParticipanteData p ON p.id = a.participanteId
                WHERE 1=1
                """);

        if (rutaId != null) jpql.append(" AND s.rutaId = :rutaId");
        if (semestre != null) jpql.append(" AND p.semestre = :semestre");
        if (fechaInicio != null) jpql.append(" AND s.fecha >= :fechaInicio");
        if (fechaFin != null) jpql.append(" AND s.fecha <= :fechaFin");
        jpql.append(" GROUP BY p.programaAcademico ORDER BY COUNT(a.id) DESC");

        var query = entityManager.createQuery(jpql.toString());
        if (rutaId != null) query.setParameter("rutaId", rutaId);
        if (semestre != null) query.setParameter("semestre", semestre);
        if (fechaInicio != null) query.setParameter("fechaInicio", fechaInicio);
        if (fechaFin != null) query.setParameter("fechaFin", fechaFin);

        List<Object[]> resultados = query.getResultList();
        List<ReporteAsistencia> reportes = new ArrayList<>();
        for (Object[] row : resultados) {
            reportes.add(new ReporteAsistencia((String) row[0], (Long) row[1]));
        }
        return reportes;
    }

    @Override
    public List<ReporteAsistencia> obtenerAsistenciaPorSemestre(Long rutaId,
                                                                String programaAcademico, LocalDate fechaInicio, LocalDate fechaFin) {

        StringBuilder jpql = new StringBuilder("""
                SELECT CAST(p.semestre AS string), COUNT(a.id)
                FROM RegistroAsistenciaData a
                JOIN SesionData s ON s.id = a.sesionId
                JOIN ParticipanteData p ON p.id = a.participanteId
                WHERE 1=1
                """);

        if (rutaId != null) jpql.append(" AND s.rutaId = :rutaId");
        if (programaAcademico != null) jpql.append(" AND p.programaAcademico = :programaAcademico");
        if (fechaInicio != null) jpql.append(" AND s.fecha >= :fechaInicio");
        if (fechaFin != null) jpql.append(" AND s.fecha <= :fechaFin");
        jpql.append(" GROUP BY p.semestre ORDER BY p.semestre");

        var query = entityManager.createQuery(jpql.toString());
        if (rutaId != null) query.setParameter("rutaId", rutaId);
        if (programaAcademico != null) query.setParameter("programaAcademico", programaAcademico);
        if (fechaInicio != null) query.setParameter("fechaInicio", fechaInicio);
        if (fechaFin != null) query.setParameter("fechaFin", fechaFin);

        List<Object[]> resultados = query.getResultList();
        List<ReporteAsistencia> reportes = new ArrayList<>();
        for (Object[] row : resultados) {
            reportes.add(new ReporteAsistencia("Semestre " + row[0], (Long) row[1]));
        }
        return reportes;
    }

    @Override
    public List<ReporteTendencia> obtenerTendenciaSemanal(Long rutaId,
                                                          LocalDate fechaInicio, LocalDate fechaFin) {

        StringBuilder jpql = new StringBuilder("""
                SELECT s.fecha, COUNT(a.id)
                FROM RegistroAsistenciaData a
                JOIN SesionData s ON s.id = a.sesionId
                WHERE 1=1
                """);

        if (rutaId != null) jpql.append(" AND s.rutaId = :rutaId");
        if (fechaInicio != null) jpql.append(" AND s.fecha >= :fechaInicio");
        if (fechaFin != null) jpql.append(" AND s.fecha <= :fechaFin");
        jpql.append(" GROUP BY s.fecha ORDER BY s.fecha");

        var query = entityManager.createQuery(jpql.toString());
        if (rutaId != null) query.setParameter("rutaId", rutaId);
        if (fechaInicio != null) query.setParameter("fechaInicio", fechaInicio);
        if (fechaFin != null) query.setParameter("fechaFin", fechaFin);

        List<Object[]> resultados = query.getResultList();
        List<ReporteTendencia> reportes = new ArrayList<>();
        for (Object[] row : resultados) {
            reportes.add(new ReporteTendencia((LocalDate) row[0], (Long) row[1]));
        }
        return reportes;
    }
}