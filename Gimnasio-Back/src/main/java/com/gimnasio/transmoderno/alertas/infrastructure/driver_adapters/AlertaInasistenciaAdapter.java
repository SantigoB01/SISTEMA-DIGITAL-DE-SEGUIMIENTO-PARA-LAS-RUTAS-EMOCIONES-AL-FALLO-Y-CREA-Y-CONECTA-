package com.gimnasio.transmoderno.alertas.infrastructure.driver_adapters;

import com.gimnasio.transmoderno.alertas.domain.model.AlertaInasistencia;
import com.gimnasio.transmoderno.alertas.domain.model.port.AlertaInasistenciaPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AlertaInasistenciaAdapter implements AlertaInasistenciaPort {

    private final EntityManager entityManager;

    @Override
    public List<AlertaInasistencia> obtenerParticipantesSinAsistir(int dias) {
        LocalDateTime fechaLimite = LocalDateTime.now().minusDays(dias);

        String jpql = """
                SELECT p.id, p.numeroIdentificacion, p.nombreCompleto,
                       r.id, r.nombre, MAX(a.fechaHoraRegistro)
                FROM ParticipanteData p
                JOIN InscripcionData i ON i.participanteId = p.id
                JOIN RutaData r ON r.id = i.rutaId
                LEFT JOIN RegistroAsistenciaData a ON a.participanteId = p.id
                WHERE i.estado = 'ACTIVA'
                GROUP BY p.id, p.numeroIdentificacion, p.nombreCompleto, r.id, r.nombre
                HAVING MAX(a.fechaHoraRegistro) IS NULL
                    OR MAX(a.fechaHoraRegistro) < :fechaLimite
                """;

        Query query = entityManager.createQuery(jpql);
        query.setParameter("fechaLimite", fechaLimite);

        List<Object[]> resultados = query.getResultList();

        return resultados.stream().map(row -> {
            LocalDateTime ultimaAsistencia = (LocalDateTime) row[5];
            long diasSinAsistir = ultimaAsistencia == null ? -1 :
                    java.time.temporal.ChronoUnit.DAYS.between(ultimaAsistencia, LocalDateTime.now());

            String nivelRiesgo;
            if (diasSinAsistir == -1 || diasSinAsistir >= 21) {
                nivelRiesgo = "ALTO";
            } else if (diasSinAsistir >= 14) {
                nivelRiesgo = "MODERADO";
            } else {
                nivelRiesgo = "LEVE";
            }

            return AlertaInasistencia.builder()
                    .participanteId((Long) row[0])
                    .numeroIdentificacion((String) row[1])
                    .nombreCompleto((String) row[2])
                    .rutaId((Long) row[3])
                    .nombreRuta((String) row[4])
                    .ultimaAsistencia(ultimaAsistencia)
                    .diasSinAsistir(diasSinAsistir)
                    .nivelRiesgo(nivelRiesgo)
                    .build();
        }).collect(Collectors.toList());
    }
}