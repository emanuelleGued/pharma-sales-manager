package com.pharmaSales.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pharmaSales.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

}