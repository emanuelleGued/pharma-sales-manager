package com.pharmasales.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pharmasales.model.Visit;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VisitRepository extends JpaRepository<Visit, Long> {

    List<Visit> findByDate(LocalDate date);
    @Query("SELECT v FROM Visit v WHERE v.doctor.id = :doctorId AND v.date BETWEEN :startDate AND :endDate")
    List<Visit> findMonthlyVisitsByDoctor(
            @Param("doctorId") Long doctorId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
