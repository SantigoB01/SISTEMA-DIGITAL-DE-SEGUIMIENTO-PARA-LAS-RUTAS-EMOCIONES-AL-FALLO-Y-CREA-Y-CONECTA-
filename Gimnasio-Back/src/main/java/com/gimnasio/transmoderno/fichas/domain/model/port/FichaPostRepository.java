package com.gimnasio.transmoderno.fichas.domain.model.port;

import com.gimnasio.transmoderno.fichas.domain.model.FichaPost;
import java.util.Optional;

public interface FichaPostRepository {
    FichaPost save(FichaPost fichaPost);
    Optional<FichaPost> findByFichaPreId(Long fichaPreId);
    Optional<FichaPost> findById(Long id);
}