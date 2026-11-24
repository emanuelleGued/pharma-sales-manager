package com.pharmasales.dto;

import java.time.LocalDate;

import com.pharmasales.model.VisitStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateVisitRequest {

    @NotNull(message = "A data da visita é obrigatória")
    private LocalDate date;

    private String observation;

    private String presentedMaterial;

    @NotNull(message = "O status da visita é obrigatório")
    private VisitStatus status;

    @NotNull(message = "O médico é obrigatório")
    private Long doctorId;

    @NotNull(message = "O usuário é obrigatório")
    private Long userId;

    private String time;
}