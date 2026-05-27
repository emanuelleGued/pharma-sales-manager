package com.pharmasales.dto;

import java.time.LocalDate;
import com.pharmasales.model.VisitStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VisitResponse {

    private Long id;

    private LocalDate date;

    private String observation;

    private VisitStatus status;

    private Long doctorId;

    private String doctorName;

    private Long userId;
}