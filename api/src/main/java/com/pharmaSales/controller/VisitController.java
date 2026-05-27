package com.pharmaSales.controller;

import java.time.LocalDate;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharmaSales.dto.CreateVisitRequest;
import com.pharmaSales.dto.UpdateVisitStatusRequest;
import com.pharmaSales.model.Visit;
import com.pharmaSales.service.VisitService;

@RestController
@RequestMapping("/visits")
public class VisitController {
    private final VisitService visitService;

    public VisitController(VisitService visitService) {
        this.visitService = visitService;
    }

    @PostMapping
    public ResponseEntity<Visit> createVisit(@RequestBody CreateVisitRequest visit) {
        Visit createdVisit = visitService.createVisit(visit);
        return ResponseEntity.ok(createdVisit);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVisit(@PathVariable Long id){
        visitService.deleteVisit(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{date}")
    public ResponseEntity<List<Visit>> listVisitByDate(@PathVariable LocalDate date){
        List<Visit> listVisits = visitService.listVisitByDate(date);
        return ResponseEntity.ok(listVisits);
    }

    @GetMapping
    public ResponseEntity<List<Visit>> listVisit(){
        List<Visit> listVisits = visitService.listVisit();
        return ResponseEntity.ok(listVisits);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Visit> updateVisit(@PathVariable Long id, @RequestBody CreateVisitRequest visit){
        Visit updatedVisit = visitService.updateVisit(id, visit);
        return ResponseEntity.ok(updatedVisit);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Visit> updateVisitStatus(@PathVariable Long id, @RequestBody UpdateVisitStatusRequest request){
        Visit updatedVisit = visitService.updateVisitStatus(id, request.isStatus());
        return ResponseEntity.ok(updatedVisit);
    }
}
