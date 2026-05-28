package com.pharmasales.controller;

import java.time.LocalDate;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharmasales.dto.CreateVisitRequest;
import com.pharmasales.dto.UpdateVisitStatusRequest;
import com.pharmasales.dto.VisitResponse;
import com.pharmasales.service.VisitService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/visits")
public class VisitController {
    private final VisitService visitService;

    public VisitController(VisitService visitService) {
        this.visitService = visitService;
    }

    @PostMapping
    public ResponseEntity<VisitResponse> createVisit(@Valid @RequestBody CreateVisitRequest visit) {
        VisitResponse createdVisit = visitService.createVisit(visit);
        return ResponseEntity.ok(createdVisit); 
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVisit(@PathVariable Long id){
        visitService.deleteVisit(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{date}")
    public ResponseEntity<List<VisitResponse>> listVisitByDate(@PathVariable LocalDate date){
        List<VisitResponse> listVisits = visitService.listVisitByDate(date);
        return ResponseEntity.ok(listVisits);
    }

    @GetMapping
    public ResponseEntity<List<VisitResponse>> listVisit(){
        List<VisitResponse> listVisits = visitService.listVisit();
        return ResponseEntity.ok(listVisits);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VisitResponse> updateVisit(@PathVariable Long id,@Valid @RequestBody CreateVisitRequest visit){
        VisitResponse updatedVisit = visitService.updateVisit(id, visit);
        return ResponseEntity.ok(updatedVisit);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<VisitResponse> updateVisitStatus(@PathVariable Long id, @RequestBody UpdateVisitStatusRequest request){
        VisitResponse updatedVisit = visitService.updateVisitStatus(id, request.getStatus());
        return ResponseEntity.ok(updatedVisit);
    }
}
