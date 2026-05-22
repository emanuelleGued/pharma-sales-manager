package com.pharmaSales.config;

import com.pharmaSales.model.Doctor;
import com.pharmaSales.repository.DoctorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DoctorSeeder {

    @Bean
    public CommandLineRunner seedDoctors(DoctorRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                return;
            }

            List<Doctor> doctors = List.of(
                    build("Dr. Marcos Silva", "CRM-SP 12345", "Cardiologista", "Clínica do Coração", "São Paulo, SP", true),
                    build("Dra. Ana Paula Costa", "CRM-SP 23456", "Pediatra", "Clínica Infantil", "São Paulo, SP", true),
                    build("Dr. Roberto Santos", "CRM-SP 34567", "Ortopedista", "OrtoCenter", "Campinas, SP", false),
                    build("Dra. Fernanda Lima", "CRM-SP 45678", "Dermatologista", "Pele e Cia", "São Paulo, SP", true),
                    build("Dr. Carlos Mendes", "CRM-SP 56789", "Clínico Geral", "Saúde Total", "Guarulhos, SP", false),
                    build("Dra. Juliana Ribeiro", "CRM-SP 67890", "Ginecologista", "Saúde da Mulher", "São Bernardo do Campo, SP", false),
                    build("Dr. Ricardo Almeida", "CRM-SP 78901", "Neurologista", "Neuro Vida", "Osasco, SP", false),
                    build("Dra. Mariana Costa", "CRM-SP 89012", "Oftalmologista", "Visão Perfeita", "Santo André, SP", true)
            );

            repository.saveAll(doctors);
        };
    }

    private Doctor build(String nome, String crm, String especialidade, String clinica, String endereco, boolean visitado) {
        Doctor d = new Doctor(nome, crm, especialidade, clinica, endereco);
        d.setVisitado(visitado);
        return d;
    }
}
