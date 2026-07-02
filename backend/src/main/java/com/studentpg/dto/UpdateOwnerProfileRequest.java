package com.studentpg.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UpdateOwnerProfileRequest {

    @NotBlank
    @Size(min = 3, max = 50)
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Pattern(regexp = "^[6-9]\\d{9}$",
            message = "Invalid mobile number")
    private String phone;
    @NotBlank
 @Pattern(regexp = "^[6-9]\\d{9}$",
         message = "Invalid WhatsApp number")
 private String whatsappNumber;

    public UpdateOwnerProfileRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
    public String getWhatsappNumber() {
     return whatsappNumber;
 }

 public void setWhatsappNumber(String whatsappNumber) {
     this.whatsappNumber = whatsappNumber;
 }
}