package com.pharmaSales.repository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pharmaSales.model.Visit;

public interface VisitRepository extends JpaRepository<Visit, Long> {

    List<Visit> findByDate(LocalDate date);
}
