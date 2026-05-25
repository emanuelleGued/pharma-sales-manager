package com.pharmaSales.dto;

import java.time.LocalDate;

public class CreateVisitRequest {

    private LocalDate date;

    private String description;

    private boolean status;

    private Long doctorId;

    private Long userId;

    public CreateVisitRequest() {
    }

    public CreateVisitRequest(
            LocalDate date,
            String description,
            boolean status,
            Long doctorId,
            Long userId
    ) {
        this.date = date;
        this.description = description;
        this.status = status;
        this.doctorId = doctorId;
        this.userId = userId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}