package com.pharmasales.dto;

import com.pharmasales.model.Doctor;

public record DoctorResponse(
        String id,
        String name,
        String crm,
        String specialty,
        String clinicName,
        String location,
        String doctorStatus
) {
    public static DoctorResponse from(Doctor doctor) {
        return new DoctorResponse(
                String.valueOf(doctor.getId()),
                doctor.getName(),
                doctor.getCrm(),
                doctor.getSpecialty(),
                doctor.getClinicName(),
                doctor.getLocation(),
                doctor.getStatus().name()
        );
    }
}
