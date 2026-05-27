package com.pharmasales.dto;

import com.pharmasales.model.VisitStatus;

public class UpdateVisitStatusRequest {
    private VisitStatus status;

    public VisitStatus getStatus() {
        return status;
    }

    public void setStatus(VisitStatus status) {
        this.status = status;
    }
}