package com.gimnasio.transmoderno.asistencia.domain.usecase;

import com.gimnasio.transmoderno.asistencia.domain.model.RegistroAsistencia;
import com.gimnasio.transmoderno.asistencia.domain.model.port.RegistroAsistenciaRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class ObtenerAsistenciasPorSesionUseCase {

    private final RegistroAsistenciaRepository registroAsistenciaRepository;

    public List<RegistroAsistencia> ejecutar(Long sesionId, int page, int size) {
        return registroAsistenciaRepository.findBySesionId(sesionId, page, size);
    }

    public long contarTotal(Long sesionId) {
        return registroAsistenciaRepository.countBySesionId(sesionId);
    }

    public List<RegistroAsistencia> ejecutarTodos(Long sesionId) {
        return registroAsistenciaRepository.findBySesionId(sesionId, 0, Integer.MAX_VALUE);
    }
}