package com.studentpg.modules.owner.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OwnerVerificationRequest {

    @NotBlank
    @Size(max = 100)
    private String legalName;

    @NotBlank
    @Pattern(regexp = "PAN|PASSPORT|DRIVING_LICENSE|VOTER_ID|AADHAAR", message = "Unsupported document type")
    private String documentType;

    @NotBlank
    @Size(min = 4, max = 40)
    @Pattern(regexp = "[A-Za-z0-9 -]+", message = "Document number contains invalid characters")
    private String documentNumber;
}