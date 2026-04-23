package com.gimnasio.transmoderno.reportes.infrastructure.entry_points.dto;

import java.time.LocalDate;

public class ReporteAsistenciaDTO {

    private Long usuarioId;
    private String nombreUsuario;
    private LocalDate fecha;
    private Integer totalAsistencias;

    public ReporteAsistenciaDTO() {}

    public ReporteAsistenciaDTO(Long usuarioId, String nombreUsuario, LocalDate fecha, Integer totalAsistencias) {
        this.usuarioId = usuarioId;
        this.nombreUsuario = nombreUsuario;
        this.fecha = fecha;
        this.totalAsistencias = totalAsistencias;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Integer getTotalAsistencias() {
        return totalAsistencias;
    }

    public void setTotalAsistencias(Integer totalAsistencias) {
        this.totalAsistencias = totalAsistencias;
    }
}