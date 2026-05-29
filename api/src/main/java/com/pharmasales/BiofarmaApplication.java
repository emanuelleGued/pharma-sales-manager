package com.pharmasales;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BiofarmaApplication {

    public static void main(String[] args) {
        SpringApplication.run(BiofarmaApplication.class, args);
    }
}