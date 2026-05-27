package com.pharmaSales.model;

public enum DoctorStatus {
    SEM_VISITAS, // nao foi agendado nenhuma visita ainda
    PENDENTE, // agendado mas n realizado (pendente, reagendado, cancelado)
    VISITADO // visita realizada (concluido)
}
