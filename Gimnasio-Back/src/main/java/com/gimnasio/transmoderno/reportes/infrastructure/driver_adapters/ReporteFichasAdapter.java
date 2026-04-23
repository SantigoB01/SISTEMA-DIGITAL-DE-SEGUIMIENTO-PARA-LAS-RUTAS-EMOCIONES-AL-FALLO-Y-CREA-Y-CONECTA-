package com.gimnasio.transmoderno.reportes.infrastructure.driver_adapters;

import com.gimnasio.transmoderno.reportes.domain.model.ReporteFichas;
import com.gimnasio.transmoderno.reportes.domain.model.port.ReporteFichasPort;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ReporteFichasAdapter implements ReporteFichasPort {

    private final EntityManager entityManager;

    @Override
    public List<ReporteFichas> obtenerComparativaPrePost(Long rutaId,
                                                         String programaAcademico) {

        StringBuilder jpql = new StringBuilder("""
                SELECT preg.texto,
                       AVG(rpre.valor),
                       AVG(rpost.valor)
                FROM PreguntaData preg
                JOIN RespuestaFichaPreData rpre ON rpre.preguntaId = preg.id
                JOIN FichaPreData fpre ON fpre.id = rpre.fichaPreId
                JOIN RespuestaFichaPostData rpost ON rpost.preguntaId = preg.id
                JOIN FichaPostData fpost ON fpost.id = rpost.fichaPostId
                JOIN InscripcionData i ON i.id = fpre.inscripcionId
                JOIN ParticipanteData p ON p.id = i.participanteId
                WHERE fpre.completada = true AND fpost.completada = true
                """);

        if (rutaId != null) jpql.append(" AND i.rutaId = :rutaId");
        if (programaAcademico != null) jpql.append(" AND p.programaAcademico = :programaAcademico");
        jpql.append(" GROUP BY preg.id, preg.texto, preg.orden ORDER BY preg.orden");

        var query = entityManager.createQuery(jpql.toString());
        if (rutaId != null) query.setParameter("rutaId", rutaId);
        if (programaAcademico != null) query.setParameter("programaAcademico", programaAcademico);

        List<Object[]> resultados = query.getResultList();
        List<ReporteFichas> reportes = new ArrayList<>();
        for (Object[] row : resultados) {
            reportes.add(new ReporteFichas(
                    (String) row[0],
                    (Double) row[1],
                    (Double) row[2]
            ));
        }
        return reportes;
    }
}