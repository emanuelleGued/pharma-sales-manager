package com.pharmasales.service;

import com.pharmasales.dto.PerformanceMetricsDTO;
import com.pharmasales.dto.PerformanceSummaryDTO;
import com.pharmasales.model.VisitStatus;
import com.pharmasales.repository.VisitRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;

@Service
public class PerformanceService {

    private final VisitRepository visitRepository;

    public PerformanceService(VisitRepository visitRepository) {
        this.visitRepository = visitRepository;
    }

    public PerformanceSummaryDTO getPerformanceSummary(Long repId) {
        LocalDate today = LocalDate.now();
        Long completedVisits = visitRepository.countVisitsByRepIdAndDateAndStatus(repId, today, VisitStatus.CONCLUIDA);
        Long totalVisits = visitRepository.countTotalVisitsByRepIdAndDate(repId, today);
        return new PerformanceSummaryDTO(completedVisits, totalVisits);
    }

    public PerformanceMetricsDTO getPerformanceMetrics(Long repId) {
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate endOfMonth = YearMonth.from(today).atEndOfMonth();

        Long uniqueDoctorsVisited = visitRepository.countUniqueDoctorsVisitedByRepIdAndPeriod(repId, startOfMonth,
                endOfMonth, VisitStatus.CONCLUIDA);
        Long targetDoctors = visitRepository.countTargetDoctorsByRepIdAndPeriod(repId, startOfMonth, endOfMonth);

        return new PerformanceMetricsDTO(uniqueDoctorsVisited, targetDoctors);
    }
}
