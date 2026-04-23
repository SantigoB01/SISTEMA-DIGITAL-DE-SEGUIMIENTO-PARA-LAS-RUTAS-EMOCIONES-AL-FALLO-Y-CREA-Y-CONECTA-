package com.gimnasio.transmoderno.reportes.infrastructure.driver_adapters;

import com.gimnasio.transmoderno.reportes.domain.model.ReporteParticipantes;
import com.gimnasio.transmoderno.reportes.domain.model.port.ReporteParticipantesPort;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ReporteParticipantesAdapter implements ReporteParticipantesPort {

    private final EntityManager entityManager;

    @Override
    public List<ReporteParticipantes> obtenerDistribucionPorPrograma(Long rutaId,
                                                                     Integer semestre) {

        StringBuilder jpql = new StringBuilder("""
                SELECT p.programaAcademico, COUNT(p.id)
                FROM ParticipanteData p
                JOIN InscripcionData i ON i.participanteId = p.id
                WHERE i.estado = 'ACTIVA'
                """);

        if (rutaId != null) jpql.append(" AND i.rutaId = :rutaId");
        if (semestre != null) jpql.append(" AND p.semestre = :semestre");
        jpql.append(" GROUP BY p.programaAcademico ORDER BY COUNT(p.id) DESC");

        var query = entityManager.createQuery(jpql.toString());
        if (rutaId != null) query.setParameter("rutaId", rutaId);
        if (semestre != null) query.setParameter("semestre", semestre);

        List<Object[]> resultados = query.getResultList();
        List<ReporteParticipantes> reportes = new ArrayList<>();
        for (Object[] row : resultados) {
            reportes.add(new ReporteParticipantes((String) row[0], (Long) row[1]));
        }
        return reportes;
    }

    @Override
    public List<ReporteParticipantes> obtenerDistribucionPorSemestre(Long rutaId,
                                                                     String programaAcademico) {

        StringBuilder jpql = new StringBuilder("""
                SELECT CAST(p.semestre AS string), COUNT(p.id)
                FROM ParticipanteData p
                JOIN InscripcionData i ON i.participanteId = p.id
                WHERE i.estado = 'ACTIVA'
                """);

        if (rutaId != null) jpql.append(" AND i.rutaId = :rutaId");
        if (programaAcademico != null) jpql.append(" AND p.programaAcademico = :programaAcademico");
        jpql.append(" GROUP BY p.semestre ORDER BY p.semestre");

        var query = entityManager.createQuery(jpql.toString());
        if (rutaId != null) query.setParameter("rutaId", rutaId);
        if (programaAcademico != null) query.setParameter("programaAcademico", programaAcademico);

        List<Object[]> resultados = query.getResultList();
        List<ReporteParticipantes> reportes = new ArrayList<>();
        for (Object[] row : resultados) {
            reportes.add(new ReporteParticipantes("Semestre " + row[0], (Long) row[1]));
        }
        return reportes;
    }

    @Override
    public List<ReporteParticipantes> obtenerParticipantesPorRuta() {

        String jpql = """
                SELECT r.nombre, COUNT(i.id)
                FROM InscripcionData i
                JOIN RutaData r ON r.id = i.rutaId
                WHERE i.estado = 'ACTIVA'
                GROUP BY r.nombre
                ORDER BY COUNT(i.id) DESC
                """;

        var query = entityManager.createQuery(jpql);
        List<Object[]> resultados = query.getResultList();
        List<ReporteParticipantes> reportes = new ArrayList<>();
        for (Object[] row : resultados) {
            reportes.add(new ReporteParticipantes((String) row[0], (Long) row[1]));
        }
        return reportes;
    }
}