package com.pharmasales.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import com.pharmasales.model.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.pharmasales.dto.CreateVisitRequest;
import com.pharmasales.dto.VisitResponse;
import com.pharmasales.repository.DoctorRepository;
import com.pharmasales.repository.NotificationRepository;
import com.pharmasales.repository.UserRepository;
import com.pharmasales.repository.VisitRepository;

@Service
public class VisitService {

    private final VisitRepository visitRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final int DAILY_GOAL = 10;

    private VisitResponse mapToResponse(Visit visit) {
        return new VisitResponse(
                visit.getId(),
                visit.getDate(),
                visit.getObservation(),
                visit.getStatus(),
                visit.getDoctor().getId(),
                visit.getDoctor().getName(),
                visit.getUser().getId(),
                visit.getTime(),
                visit.getPresentedMaterial()
        );
    }

    public VisitService(
            VisitRepository visitRepository,
            DoctorRepository doctorRepository,
            UserRepository userRepository,
            NotificationRepository notificationRepository
    ) {
        this.visitRepository = visitRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    private void createNotification(String title, String message, User user, NotificationType type, Long visitId) {
        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setUserIdDestiny(user.getId());
        notification.setRole(user.getRole());
        notification.setType(type);
        notification.setVisitId(visitId);
        notificationRepository.save(notification);
    }

    private void notifyDailyGoalProgress(User user) {
        Long completedToday = visitRepository.countVisitsByRepIdAndDateAndStatus(
                user.getId(), LocalDate.now(), VisitStatus.CONCLUIDA);

        if (completedToday == null) return;

        if (completedToday >= DAILY_GOAL) {
            createNotification(
                    "Meta diária atingida",
                    String.format("Parabéns! Você completou %d visitas hoje", completedToday),
                    user,
                    NotificationType.SUCCESS,
                    null
            );
        } else {
            long remaining = DAILY_GOAL - completedToday;
            createNotification(
                    "Progresso da meta",
                    String.format("Faltam %d visita%s para você atingir sua meta diária",
                            remaining, remaining > 1 ? "s" : ""),
                    user,
                    NotificationType.GOAL,
                    null
            );
        }
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
        visit.setTime(request.getTime());
        visit.setObservation(request.getObservation());
        visit.setStatus(request.getStatus());
        visit.setDoctor(doctor);
        visit.setUser(user);

        Visit savedVisit = visitRepository.save(visit);

        syncDoctorStatus(doctor);

        createNotification(
                "Nova visita agendada",
                String.format("Visita com %s em %s%s",
                        doctor.getName(),
                        savedVisit.getDate().format(DATE_FORMATTER),
                        savedVisit.getTime() != null ? " às " + savedVisit.getTime() : ""),
                user,
                NotificationType.VISIT,
                savedVisit.getId()
        );

        return new VisitResponse(
                savedVisit.getId(),
                savedVisit.getDate(),
                savedVisit.getObservation(),
                savedVisit.getStatus(),
                doctor.getId(),
                doctor.getName(),
                user.getId(),
                savedVisit.getTime(),
                savedVisit.getPresentedMaterial()
        );
    }

    public void deleteVisit(Long id) {
        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Visita não encontrada"
                ));
        Doctor doctor = visit.getDoctor();

        visitRepository.delete(visit);
        syncDoctorStatus(doctor);
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

        VisitStatus previousStatus = visit.getStatus();

        visit.setDate(request.getDate());
        visit.setTime(request.getTime());
        visit.setObservation(request.getObservation());
        visit.setStatus(request.getStatus());
        visit.setDoctor(doctor);
        visit.setUser(user);

        Visit updatedVisit = visitRepository.save(visit);

        syncDoctorStatus(updatedVisit.getDoctor());

        if (request.getStatus() == VisitStatus.CONCLUIDA && previousStatus != VisitStatus.CONCLUIDA) {
            createNotification(
                    "Visita concluída",
                    String.format("Visita com %s em %s foi concluída",
                            doctor.getName(),
                            updatedVisit.getDate().format(DATE_FORMATTER)),
                    user,
                    NotificationType.SUCCESS,
                    updatedVisit.getId()
            );
            if (updatedVisit.getDate().equals(LocalDate.now())) {
                notifyDailyGoalProgress(user);
            }
        }

        return mapToResponse(updatedVisit);
    }

    public VisitResponse updateVisitStatus(Long id, VisitStatus status) {
        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Visita não encontrada"
                ));

        VisitStatus previousStatus = visit.getStatus();
        visit.setStatus(status);

        Visit updatedVisit = visitRepository.save(visit);

        if (status == VisitStatus.CONCLUIDA && previousStatus != VisitStatus.CONCLUIDA) {
            createNotification(
                    "Visita concluída",
                    String.format("Visita com %s em %s foi concluída",
                            updatedVisit.getDoctor().getName(),
                            updatedVisit.getDate().format(DATE_FORMATTER)),
                    updatedVisit.getUser(),
                    NotificationType.SUCCESS,
                    updatedVisit.getId()
            );
            if (updatedVisit.getDate().equals(LocalDate.now())) {
                notifyDailyGoalProgress(updatedVisit.getUser());
            }
        }

        return mapToResponse(updatedVisit);
    }

    private void syncDoctorStatus(Doctor doctor) {
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate endOfMonth = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());

        List<Visit> monthlyVisits = visitRepository.findMonthlyVisitsByDoctor(doctor.getId(), startOfMonth, endOfMonth);

        DoctorStatus newStatus = DoctorStatus.SEM_VISITAS;

        boolean hasCompleted = monthlyVisits.stream().anyMatch(v -> v.getStatus() == VisitStatus.CONCLUIDA);
        boolean hasPending = monthlyVisits.stream().anyMatch(v ->
                v.getStatus() == VisitStatus.AGENDADA || v.getStatus() == VisitStatus.REAGENDADA
        );

        if (hasCompleted) {
            newStatus = DoctorStatus.VISITADO;
        } else if (hasPending) {
            newStatus = DoctorStatus.PENDENTE;
        }

        if (doctor.getStatus() != newStatus) {
            doctor.setStatus(newStatus);
            doctorRepository.save(doctor);
        }
    }
}