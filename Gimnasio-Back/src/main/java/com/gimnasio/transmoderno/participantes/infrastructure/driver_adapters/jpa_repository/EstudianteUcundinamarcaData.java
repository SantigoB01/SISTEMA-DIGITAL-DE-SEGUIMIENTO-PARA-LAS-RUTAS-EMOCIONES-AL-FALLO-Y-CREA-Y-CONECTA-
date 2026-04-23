package com.gimnasio.transmoderno.participantes.infrastructure.driver_adapters.jpa_repository;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "estudiante_ucundinamarca")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstudianteUcundinamarcaData {

    @Id
    @Column(name = "documento", length = 20)
    private String documento;

    @Column(name = "tipo_documento", length = 10)
    private String tipoDocumento;

    @Column(name = "primer_apellido", length = 50)
    private String primerApellido;

    @Column(name = "segundo_apellido", length = 50)
    private String segundoApellido;

    @Column(name = "primer_nombre", length = 50)
    private String primerNombre;

    @Column(name = "segundo_nombre", length = 50)
    private String segundoNombre;

    @Column(name = "nombre_completo", length = 150)
    private String nombreCompleto;

    @Column(name = "modalidad", length = 20)
    private String modalidad;

    @Column(name = "correo_institucional", length = 150)
    private String correoInstitucional;

    @Column(name = "sede", length = 100)
    private String sede;

    @Column(name = "pensum", length = 100)
    private String pensum;
}