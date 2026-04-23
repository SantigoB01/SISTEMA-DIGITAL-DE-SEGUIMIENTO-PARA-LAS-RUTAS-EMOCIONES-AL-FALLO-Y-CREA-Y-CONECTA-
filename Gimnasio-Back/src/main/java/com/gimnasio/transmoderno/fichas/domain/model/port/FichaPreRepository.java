package com.gimnasio.transmoderno.fichas.domain.model.port;

import com.gimnasio.transmoderno.fichas.domain.model.FichaPre;
import java.util.Optional;

public interface FichaPreRepository {
    FichaPre save(FichaPre fichaPre);
    Optional<FichaPre> findByInscripcionId(Long inscripcionId);
    Optional<FichaPre> findById(Long id);
}