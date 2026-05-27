package com.pharmasales.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
    private Long id;
    private String name;
    private String email;
    private String password;
    private String role;
    
    public Long getId() {
        return id;
    }
}
