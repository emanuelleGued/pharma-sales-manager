package com.pharmasales.model;

import jakarta.persistence.*;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String crm;

    @Column(nullable = false)
    private String specialty;

    @Column(name = "clinic_name", nullable = false)
    private String clinicName;

    @Column(nullable = false)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DoctorStatus status = DoctorStatus.SEM_VISITAS;

    protected Doctor() {
    }

    public Doctor(String name, String crm, String specialty, String clinicName, String location) {
        this.name = name;
        this.crm = crm;
        this.specialty = specialty;
        this.clinicName = clinicName;
        this.location = location;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCrm() {
        return crm;
    }

    public String getSpecialty() {
        return specialty;
    }

    public String getClinicName() {
        return clinicName;
    }

    public String getLocation() {
        return location;
    }

    public DoctorStatus getStatus() { return status; }

    public void setName(String name) {
        this.name = name;
    }

    public void setCrm(String crm) {
        this.crm = crm;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public void setClinicName(String clinicName) {
        this.clinicName = clinicName;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setStatus(DoctorStatus status) {
        this.status = status;
    }
}
