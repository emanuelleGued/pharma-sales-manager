package com.pharmasales.controller;

import com.pharmasales.dto.PerformanceMetricsDTO;
import com.pharmasales.dto.PerformanceSummaryDTO;
import com.pharmasales.service.PerformanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/performance")
public class PerformanceController {

    private final PerformanceService performanceService;

    public PerformanceController(PerformanceService performanceService) {
        this.performanceService = performanceService;
    }

    @GetMapping("/summary")
    public ResponseEntity<PerformanceSummaryDTO> getSummary(@RequestParam("repId") Long repId) {
        return ResponseEntity.ok(performanceService.getPerformanceSummary(repId));
    }

    @GetMapping("/metrics")
    public ResponseEntity<PerformanceMetricsDTO> getMetrics(@RequestParam("repId") Long repId) {
        return ResponseEntity.ok(performanceService.getPerformanceMetrics(repId));
    }
}
