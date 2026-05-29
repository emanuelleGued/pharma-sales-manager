package com.pharmasales.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.pharmasales.model.User;
import com.pharmasales.model.UserRole;
import com.pharmasales.repository.UserRepository;

@Configuration
public class UserSeeder {

    @Bean
    public CommandLineRunner seedUsers(UserRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                return;
            }

            // Usuário padrão usado pelo app (o mobile envia userId: 1 por enquanto).
            // Como o banco é recriado limpo, o primeiro insert recebe id = 1.
            repository.save(new User(
                    "Representante Demo",
                    "rep@demo.com",
                    "demo",
                    UserRole.REPRESENTATIVE
            ));
        };
    }
}
