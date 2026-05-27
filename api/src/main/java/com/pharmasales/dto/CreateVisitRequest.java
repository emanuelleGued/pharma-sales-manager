package com.pharmasales.dto;

import java.time.LocalDate;

import com.pharmasales.model.VisitStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateVisitRequest {

    @NotNull(message = "A data da visita é obrigatória")
    private LocalDate date;

    @NotBlank(message = "A descrição é obrigatória")
    private String observation;

    @NotNull(message = "O status da visita é obrigatório")
    private VisitStatus status;

    @NotNull(message = "O médico é obrigatório")
    private Long doctorId;

    @NotNull(message = "O usuário é obrigatório")
    private Long userId;

    private String time;
}