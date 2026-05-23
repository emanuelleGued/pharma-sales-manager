package com.pharmaSales.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO para requisição de criação de novo médico
 */
public record CreateDoctorRequest(
        @NotBlank(message = "Nome é obrigatório")
        String name,

        @NotBlank(message = "CRM é obrigatório")
        String crm,

        @NotBlank(message = "Especialidade é obrigatória")
        String specialty,

        @NotBlank(message = "Nome da clínica é obrigatório")
        String clinicName,

        @NotBlank(message = "Endereço é obrigatório")
        String location
) {
}
