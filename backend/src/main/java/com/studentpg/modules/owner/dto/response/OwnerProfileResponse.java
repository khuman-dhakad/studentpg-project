package com.studentpg.modules.owner.dto.response;

import com.studentpg.modules.owner.entity.VerificationStatus;

public class OwnerProfileResponse {

    private String id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private String whatsappNumber;
    private VerificationStatus verificationStatus;
    private String verificationRejectionReason;

    public OwnerProfileResponse() {}

    public OwnerProfileResponse(String id, String name, String email, String phone,
                                 String role, String whatsappNumber,
                                 VerificationStatus verificationStatus,
                                 String verificationRejectionReason) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.whatsappNumber = whatsappNumber;
        this.verificationStatus = verificationStatus;
        this.verificationRejectionReason = verificationRejectionReason;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getWhatsappNumber() { return whatsappNumber; }
    public void setWhatsappNumber(String whatsappNumber) { this.whatsappNumber = whatsappNumber; }
    public VerificationStatus getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(VerificationStatus verificationStatus) { this.verificationStatus = verificationStatus; }
    public String getVerificationRejectionReason() { return verificationRejectionReason; }
    public void setVerificationRejectionReason(String verificationRejectionReason) { this.verificationRejectionReason = verificationRejectionReason; }
}