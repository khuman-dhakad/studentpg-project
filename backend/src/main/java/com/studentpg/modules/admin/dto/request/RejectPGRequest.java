package com.studentpg.modules.admin.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RejectPGRequest {

    @NotBlank(message = "Rejection reason is required")
    @Size(
            min = 5,
            max = 500,
            message = "Rejection reason must be between 5 and 500 characters"
    )
    private String reason;

    public RejectPGRequest() {
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}