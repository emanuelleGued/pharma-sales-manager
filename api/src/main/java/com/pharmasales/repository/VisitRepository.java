package com.pharmasales.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pharmasales.model.Visit;

public interface VisitRepository extends JpaRepository<Visit, Long> {

    List<Visit> findByDate(LocalDate date);
}
