package com.pharmasales.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pharmasales.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

}