package com.pharmasales.service;

import com.pharmasales.model.Notification;
import com.pharmasales.model.NotificationType;
import com.pharmasales.model.Visit;
import com.pharmasales.model.VisitStatus;
import com.pharmasales.repository.NotificationRepository;
import com.pharmasales.repository.VisitRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class NotificationScheduler {

    private final VisitRepository visitRepository;
    private final NotificationRepository notificationRepository;

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");
    private static final long UPCOMING_WINDOW_MINUTES = 60;

    public NotificationScheduler(VisitRepository visitRepository, NotificationRepository notificationRepository) {
        this.visitRepository = visitRepository;
        this.notificationRepository = notificationRepository;
    }

    @Scheduled(cron = "0 0 7 * * *")
    public void sendDailySummary() {
        List<Visit> todayVisits = visitRepository
                .findByDateAndStatus(LocalDate.now(), VisitStatus.AGENDADA);
        if (todayVisits.isEmpty()) return;

        Map<Long, List<Visit>> byUser = todayVisits.stream()
                .filter(v -> v.getUser() != null)
                .collect(Collectors.groupingBy(v -> v.getUser().getId()));

        byUser.forEach((userId, visits) -> {
            Visit first = visits.stream()
                    .min((a, b) -> compareTime(a.getTime(), b.getTime()))
                    .orElse(visits.get(0));

            String message = String.format(
                    "Você tem %d visita%s agendada%s hoje. Primeira com %s%s",
                    visits.size(),
                    visits.size() > 1 ? "s" : "",
                    visits.size() > 1 ? "s" : "",
                    first.getDoctor().getName(),
                    first.getTime() != null ? " às " + first.getTime() : ""
            );

            saveNotification("Resumo do dia", message, NotificationType.REMINDER, first, null);
        });
    }

    @Scheduled(fixedRate = 15 * 60 * 1000)
    public void sendUpcomingVisitReminders() {
        List<Visit> todayVisits = visitRepository
                .findByDateAndStatus(LocalDate.now(), VisitStatus.AGENDADA);

        LocalDateTime now = LocalDateTime.now();

        for (Visit visit : todayVisits) {
            if (visit.getTime() == null || visit.getUser() == null) continue;

            LocalTime visitTime;
            try {
                visitTime = LocalTime.parse(visit.getTime(), TIME_FORMATTER);
            } catch (Exception ignored) {
                continue;
            }

            LocalDateTime visitMoment = LocalDateTime.of(visit.getDate(), visitTime);
            long minutesUntil = java.time.Duration.between(now, visitMoment).toMinutes();

            if (minutesUntil <= 0 || minutesUntil > UPCOMING_WINDOW_MINUTES) continue;
            if (notificationRepository.existsByVisitIdAndType(visit.getId(), NotificationType.REMINDER)) continue;

            String message = String.format("Próxima visita em %d min: %s às %s",
                    minutesUntil, visit.getDoctor().getName(), visit.getTime());

            saveNotification("Lembrete de visita", message, NotificationType.REMINDER, visit, visit.getId());
        }
    }

    private void saveNotification(String title, String message, NotificationType type, Visit visit, Long visitId) {
        Notification n = new Notification();
        n.setTitle(title);
        n.setMessage(message);
        n.setRead(false);
        n.setCreatedAt(LocalDateTime.now());
        n.setUserIdDestiny(visit.getUser().getId());
        n.setRole(visit.getUser().getRole());
        n.setType(type);
        n.setVisitId(visitId);
        notificationRepository.save(n);
    }

    private int compareTime(String a, String b) {
        if (a == null && b == null) return 0;
        if (a == null) return 1;
        if (b == null) return -1;
        return a.compareTo(b);
    }
}
