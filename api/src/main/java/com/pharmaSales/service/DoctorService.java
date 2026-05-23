package com.pharmaSales.service;

import com.pharmaSales.dto.CreateDoctorRequest;
import com.pharmaSales.dto.DoctorResponse;
import com.pharmaSales.model.Doctor;
import com.pharmaSales.repository.DoctorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<DoctorResponse> list(String search) {
        List<Doctor> doctors = (search == null || search.isBlank())
                ? doctorRepository.findAllByOrderByNomeAsc()
                : doctorRepository
                        .findByNomeContainingIgnoreCaseOrEspecialidadeContainingIgnoreCaseOrderByNomeAsc(
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
