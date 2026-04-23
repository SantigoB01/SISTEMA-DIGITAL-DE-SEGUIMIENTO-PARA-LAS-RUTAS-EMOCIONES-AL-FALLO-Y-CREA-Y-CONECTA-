package com.gimnasio.transmoderno.participantes.infrastructure.driver_adapters.jpa_repository;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "participantes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParticipanteData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_identificacion", nullable = false, unique = true, length = 20)
    private String numeroIdentificacion;

    @Column(name = "nombre_completo", nullable = false, length = 150)
    private String nombreCompleto;

    @Column(name = "correo_institucional", nullable = false, length = 150)
    private String correoInstitucional;

    @Column(name = "programa_academico", nullable = false, length = 100)
    private String programaAcademico;

    @Column(nullable = true)
    private Integer semestre;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDateTime fechaRegistro;

    @Column(nullable = false)
    private Boolean activo;

    @Column(name = "tipo_documento", length = 10)
    private String tipoDocumento;

    @Column(name = "sede", length = 100)
    private String sede;

    @Column(name = "telefono", length = 15)
    private String telefono;

    @Column(name = "estamento", length = 20)
    private String estamento;

    @PrePersist
    public void prePersist() {
        this.fechaRegistro = LocalDateTime.now();
        this.activo = true;
        if (this.estamento == null) this.estamento = "ESTUDIANTE";
    }
}