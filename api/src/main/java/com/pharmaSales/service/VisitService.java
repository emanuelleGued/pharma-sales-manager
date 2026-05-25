package com.pharmaSales.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.pharmaSales.dto.CreateVisitRequest;
import com.pharmaSales.model.Doctor;
import com.pharmaSales.model.User;
import com.pharmaSales.model.Visit;
import com.pharmaSales.repository.DoctorRepository;
import com.pharmaSales.repository.UserRepository;
import com.pharmaSales.repository.VisitRepository;

@Service
public class VisitService {

    private final VisitRepository visitRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    public VisitService(
            VisitRepository visitRepository,
            DoctorRepository doctorRepository,
            UserRepository userRepository
    ) {
        this.visitRepository = visitRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
    }

    public Visit createVisit(CreateVisitRequest request) {

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Visit visit = new Visit();

        visit.setDate(request.getDate());
        visit.setDescription(request.getDescription());
        visit.setStatus(request.isStatus());
        visit.setDoctor(doctor);
        visit.setUser(user);

        return visitRepository.save(visit);
    }

    public void deleteVisit(Long id) {

        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visit not found"));

        visitRepository.delete(visit);
    }

    public List<Visit> listVisit() {
        return visitRepository.findAll();
    }

    public List<Visit> listVisitByDate(LocalDate date) {
        return visitRepository.findByDate(date);
    }

    public Visit updateVisit(Long id, CreateVisitRequest request) {

        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visit not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        visit.setDate(request.getDate());
        visit.setDescription(request.getDescription());
        visit.setStatus(request.isStatus());
        visit.setDoctor(doctor);
        visit.setUser(user);

        return visitRepository.save(visit);
    }

    public Visit updateVisitStatus(Long id, boolean status) {

        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visit not found"));

        visit.setStatus(status);

        return visitRepository.save(visit);
    }
}