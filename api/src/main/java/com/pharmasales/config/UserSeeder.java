package com.pharmasales.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.pharmasales.model.User;
import com.pharmasales.model.UserRole;
import com.pharmasales.repository.UserRepository;

@Configuration
public class UserSeeder {

    @Bean
    public CommandLineRunner seedUsers(UserRepository repository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (repository.count() > 0) {
                return;
            }

            repository.save(new User(
                    "Representante Demo",
                    "rep@demo.com",
                    passwordEncoder.encode("demo"),
                    UserRole.REPRESENTATIVE
            ));
        };
    }
}