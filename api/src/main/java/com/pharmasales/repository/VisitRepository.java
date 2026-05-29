package com.pharmasales.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pharmasales.model.Visit;
import com.pharmasales.model.VisitStatus;
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

    @Query("SELECT COUNT(v) FROM Visit v WHERE v.user.id = :repId AND v.date = :date AND v.status = :status")
    Long countVisitsByRepIdAndDateAndStatus(@Param("repId") Long repId, @Param("date") LocalDate date, @Param("status") VisitStatus status);

    @Query("SELECT COUNT(v) FROM Visit v WHERE v.user.id = :repId AND v.date = :date")
    Long countTotalVisitsByRepIdAndDate(@Param("repId") Long repId, @Param("date") LocalDate date);

    @Query("SELECT COUNT(v) FROM Visit v WHERE v.user.id = :repId AND v.date BETWEEN :startDate AND :endDate AND v.status = :status")
    Long countVisitsByRepIdAndPeriodAndStatus(@Param("repId") Long repId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("status") VisitStatus status);

    @Query("SELECT COUNT(v) FROM Visit v WHERE v.user.id = :repId AND v.date BETWEEN :startDate AND :endDate")
    Long countTotalVisitsByRepIdAndPeriod(@Param("repId") Long repId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(DISTINCT v.doctor.id) FROM Visit v WHERE v.user.id = :repId AND v.date BETWEEN :startDate AND :endDate AND v.status = :status")
    Long countUniqueDoctorsVisitedByRepIdAndPeriod(@Param("repId") Long repId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("status") VisitStatus status);

    @Query("SELECT COUNT(DISTINCT v.doctor.id) FROM Visit v WHERE v.user.id = :repId AND v.date BETWEEN :startDate AND :endDate")
    Long countTargetDoctorsByRepIdAndPeriod(@Param("repId") Long repId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT v FROM Visit v WHERE v.date = :date AND v.status = :status")
    List<Visit> findByDateAndStatus(@Param("date") LocalDate date, @Param("status") VisitStatus status);
}
