package com.pharmasales.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.pharmasales.dto.CreateDoctorRequest;
import com.pharmasales.dto.DoctorResponse;
import com.pharmasales.model.Doctor;
import com.pharmasales.repository.DoctorRepository;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<DoctorResponse> list(String search) {
        List<Doctor> doctors = (search == null || search.isBlank())
                ? doctorRepository.findAllByOrderByNameAsc()
                : doctorRepository
                        .findByNameContainingIgnoreCaseOrSpecialtyContainingIgnoreCaseOrderByNameAsc(
                                search.trim(), search.trim());

        return doctors.stream().map(DoctorResponse::from).toList();
    }

    public DoctorResponse findById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Médico não encontrado"));
        return DoctorResponse.from(doctor);
    }

    public DoctorResponse create(CreateDoctorRequest request) {
        boolean crmExists = doctorRepository.existsByCrm(request.crm());
        if (crmExists) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "CRM já cadastrado");
        }

        Doctor doctor = new Doctor(
                request.name(),
                request.crm(),
                request.specialty(),
                request.clinicName(),
                request.location()
        );

        Doctor savedDoctor = doctorRepository.save(doctor);
        return DoctorResponse.from(savedDoctor);
    }
}
