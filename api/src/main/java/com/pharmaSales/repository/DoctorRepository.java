package com.pharmaSales.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pharmaSales.model.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

}