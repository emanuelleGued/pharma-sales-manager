package com.pharmasales.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.pharmasales.dto.CreateVisitRequest;
import com.pharmasales.dto.VisitResponse;
import com.pharmasales.model.Doctor;
import com.pharmasales.model.User;
import com.pharmasales.model.Visit;
import com.pharmasales.model.VisitStatus;
import com.pharmasales.repository.DoctorRepository;
import com.pharmasales.repository.UserRepository;
import com.pharmasales.repository.VisitRepository;

@Service
public class VisitService {

    private final VisitRepository visitRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    private VisitResponse mapToResponse(Visit visit) {
        return new VisitResponse(
                visit.getId(),
                visit.getDate(),
                visit.getObservation(),
                visit.getStatus(),
                visit.getDoctor().getId(),
                visit.getDoctor().getName(),
                visit.getUser().getId()
        );
    }

    public VisitService(
            VisitRepository visitRepository,
            DoctorRepository doctorRepository,
            UserRepository userRepository
    ) {
        this.visitRepository = visitRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
    }

    public VisitResponse createVisit(CreateVisitRequest request) {

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Médico não encontrado"
                ));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário não encontrado"
                ));

        Visit visit = new Visit();

        visit.setDate(request.getDate());
        visit.setObservation(request.getObservation());
        visit.setStatus(request.getStatus());
        visit.setDoctor(doctor);
        visit.setUser(user);

        Visit savedVisit = visitRepository.save(visit);

        return new VisitResponse(
                savedVisit.getId(),
                savedVisit.getDate(),
                savedVisit.getObservation(),
                savedVisit.getStatus(),
                doctor.getId(),
                doctor.getName(),
                user.getId()
        );
    }

    public void deleteVisit(Long id) {
        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Visita não encontrada"
                ));

        visitRepository.delete(visit);
    }

    public List<VisitResponse> listVisit() {
        return visitRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<VisitResponse> listVisitByDate(LocalDate date) {
        return visitRepository.findByDate(date)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public VisitResponse updateVisit(Long id, CreateVisitRequest request) {
        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, 
                    "Visita não encontrada"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, 
                    "Médico não encontrado"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, 
                    "Usuário não encontrado"));

        visit.setDate(request.getDate());
        visit.setObservation(request.getObservation());
        visit.setStatus(request.getStatus());
        visit.setDoctor(doctor);
        visit.setUser(user);

        Visit updatedVisit = visitRepository.save(visit);

        return mapToResponse(updatedVisit);
    }

    public VisitResponse updateVisitStatus(Long id, VisitStatus status) {
        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, 
                    "Visita não encontrada"
                ));

        visit.setStatus(status);

        Visit updatedVisit = visitRepository.save(visit);

        return mapToResponse(updatedVisit);
    }
}