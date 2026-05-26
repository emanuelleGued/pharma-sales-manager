package com.pharmaSales.dto;

import com.pharmaSales.model.Doctor;

public record DoctorResponse(
        String id,
        String name,
        String crm,
        String specialty,
        String clinicName,
        String location,
        boolean visited
) {
    public static DoctorResponse from(Doctor doctor) {
        return new DoctorResponse(
                String.valueOf(doctor.getId()),
                doctor.getName(),
                doctor.getCrm(),
                doctor.getSpecialty(),
                doctor.getClinicName(),
                doctor.getLocation(),
                doctor.isVisited()
        );
    }
}
