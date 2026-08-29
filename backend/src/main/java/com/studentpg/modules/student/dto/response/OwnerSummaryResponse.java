package com.studentpg.modules.student.dto.response;

public class OwnerSummaryResponse {

    private String id;
    private String name;
    private String email;
    private String phone;
    private String whatsappNumber;
    private boolean verified;

    public OwnerSummaryResponse() {
    }

    public OwnerSummaryResponse(String id, String name, String email, String phone, String whatsappNumber) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.whatsappNumber = whatsappNumber;
    }

    public OwnerSummaryResponse(String id, String name, String email, String phone,
                                String whatsappNumber, boolean verified) {
        this(id, name, email, phone, whatsappNumber);
        this.verified = verified;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }
}
