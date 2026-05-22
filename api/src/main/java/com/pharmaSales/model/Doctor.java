package com.pharmaSales.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "doctors") 
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String crm;

    @Column(nullable = false)
    private String especialidade;

    @Column(name = "clinica_nome", nullable = false)
    private String clinicaNome;

    @Column(nullable = false)
    private String endereco;

    @Column(nullable = false)
    private boolean visitado = false;

    protected Doctor() {
    }

    public Doctor(String nome, String crm, String especialidade, String clinicaNome, String endereco) {
        this.nome = nome;
        this.crm = crm;
        this.especialidade = especialidade;
        this.clinicaNome = clinicaNome;
        this.endereco = endereco;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getCrm() {
        return crm;
    }

    public String getEspecialidade() {
        return especialidade;
    }

    public String getClinicaNome() {
        return clinicaNome;
    }

    public String getEndereco() {
        return endereco;
    }

    public boolean isVisitado() {
        return visitado;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setCrm(String crm) {
        this.crm = crm;
    }

    public void setEspecialidade(String especialidade) {
        this.especialidade = especialidade;
    }

    public void setClinicaNome(String clinicaNome) {
        this.clinicaNome = clinicaNome;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public void setVisitado(boolean visitado) {
        this.visitado = visitado;
    }
}
