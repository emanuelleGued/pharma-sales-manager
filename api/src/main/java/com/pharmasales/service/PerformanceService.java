package com.pharmasales.service;

import com.pharmasales.dto.PerformanceMetricsDTO;
import com.pharmasales.dto.PerformanceSummaryDTO;
import com.pharmasales.model.VisitStatus;
import com.pharmasales.repository.DoctorRepository;
import com.pharmasales.repository.VisitRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;

@Service
public class PerformanceService {

    private final VisitRepository visitRepository;
    private final DoctorRepository doctorRepository;

    public PerformanceService(VisitRepository visitRepository, DoctorRepository doctorRepository) {
        this.visitRepository = visitRepository;
        this.doctorRepository = doctorRepository;
    }

    public PerformanceSummaryDTO getPerformanceSummary(Long repId) {
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate endOfMonth = YearMonth.from(today).atEndOfMonth();

        Long completedVisits = visitRepository.countVisitsByRepIdAndPeriodAndStatus(
                repId, startOfMonth, endOfMonth, VisitStatus.CONCLUIDA);
        Long totalVisits = visitRepository.countTotalVisitsByRepIdAndPeriod(
                repId, startOfMonth, endOfMonth);
        return new PerformanceSummaryDTO(completedVisits, totalVisits);
    }

    public PerformanceMetricsDTO getPerformanceMetrics(Long repId) {
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate endOfMonth = YearMonth.from(today).atEndOfMonth();

        Long uniqueDoctorsVisited = visitRepository.countUniqueDoctorsVisitedByRepIdAndPeriod(repId, startOfMonth,
                endOfMonth, VisitStatus.CONCLUIDA);
        Long targetDoctors = doctorRepository.count();

        return new PerformanceMetricsDTO(uniqueDoctorsVisited, targetDoctors);
    }
}
