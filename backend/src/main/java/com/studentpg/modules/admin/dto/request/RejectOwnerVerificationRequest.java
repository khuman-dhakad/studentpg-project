package com.studentpg.modules.admin.dto.request;

import jakarta.validation.constraints.NotBlank;

public record RejectOwnerVerificationRequest(@NotBlank String reason) {}