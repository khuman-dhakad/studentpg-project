package com.studentpg.modules.owner.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Document(collection = "owners")
public class Owner {

    @Id
    private String id;

    @NotBlank
    @Size(max=80)
    private String name;

    @NotBlank
    @Email
    @Indexed(unique = true)
    private String email;

    @JsonIgnore
    @Size(min = 60, max = 255)
    private String password;
    @Pattern(regexp="^[6-9][0-9]{9}$")
    private String phone;
    private String role;
    private String whatsappNumber;

    private String profileImageUrl;
    private String profileImagePublicId;

    private boolean emailVerified = false;
    private boolean active = true;

    private VerificationStatus verificationStatus = VerificationStatus.NOT_VERIFIED;
    private String verificationLegalName;
    private String verificationDocumentType;
    @JsonIgnore
    private String verificationDocumentNumber;
    @JsonIgnore
    private byte[] verificationDocumentData;
    @JsonIgnore
    private String verificationDocumentContentType;
    @JsonIgnore
    private String verificationDocumentFilename;
    @JsonIgnore
    private String verificationDocumentUrl;
    @JsonIgnore
    private String verificationDocumentPublicId;
    private java.time.Instant verificationSubmittedAt;
    private java.time.Instant verificationReviewedAt;
    private java.time.Instant verifiedAt;
    private String verificationReviewedBy;
    private String verificationRejectionReason;

    /*
     * Password reset OTP security
     *
     * Never store the actual OTP.
     * Store only its hash.
     */

    @JsonIgnore
    private String resetOtpHash;
    @JsonIgnore
    private Long resetOtpExpiry;
    private int resetOtpAttempts = 0;

    /*
     * Login attack protection
     */
    @JsonIgnore
    private int failedLoginAttempts = 0;
    @JsonIgnore
    private Long lockedUntil;

    /*
     * OTP spam protection
     */
    private Long lastOtpSentAt;
    private int otpRequestCount = 0;
    private Long otpWindowStart;

    /*
     * Increment this after password change/reset.
     * Existing JWT tokens become invalid.
     */
    @JsonIgnore
    private long tokenVersion = 0;

    public Owner() {
    }

    public Owner(
        String name,
        String email,
        String password,
        String phone,
        String role,
        String profileImageUrl,
        String profileImagePublicId,
        boolean emailVerified,
        boolean active,
        String whatsappNumber
) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.role = role;
        this.whatsappNumber = whatsappNumber;
        this.profileImageUrl = profileImageUrl;
        this.profileImagePublicId = profileImagePublicId;
        this.emailVerified = emailVerified;
        this.active = active;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getWhatsappNumber() {
        return whatsappNumber;
    }

    public void setWhatsappNumber(String whatsappNumber) {
        this.whatsappNumber = whatsappNumber;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public String getProfileImagePublicId() {
        return profileImagePublicId;
    }

    public void setProfileImagePublicId(String profileImagePublicId) {
        this.profileImagePublicId = profileImagePublicId;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public String getResetOtpHash() {
        return resetOtpHash;
    }
    public boolean isActive() {
    return active;
}

public void setActive(boolean active) {
    this.active = active;
}

    public void setResetOtpHash(String resetOtpHash) {
        this.resetOtpHash = resetOtpHash;
    }

    public Long getResetOtpExpiry() {
        return resetOtpExpiry;
    }

    public void setResetOtpExpiry(Long resetOtpExpiry) {
        this.resetOtpExpiry = resetOtpExpiry;
    }

    public int getResetOtpAttempts() {
        return resetOtpAttempts;
    }

    public void setResetOtpAttempts(int resetOtpAttempts) {
        this.resetOtpAttempts = resetOtpAttempts;
    }

    public int getFailedLoginAttempts() {
        return failedLoginAttempts;
    }

    public void setFailedLoginAttempts(int failedLoginAttempts) {
        this.failedLoginAttempts = failedLoginAttempts;
    }

    public Long getLockedUntil() {
        return lockedUntil;
    }

    public void setLockedUntil(Long lockedUntil) {
        this.lockedUntil = lockedUntil;
    }

    public Long getLastOtpSentAt() {
        return lastOtpSentAt;
    }

    public void setLastOtpSentAt(Long lastOtpSentAt) {
        this.lastOtpSentAt = lastOtpSentAt;
    }

    public int getOtpRequestCount() {
        return otpRequestCount;
    }

    public void setOtpRequestCount(int otpRequestCount) {
        this.otpRequestCount = otpRequestCount;
    }

    public Long getOtpWindowStart() {
        return otpWindowStart;
    }

    public void setOtpWindowStart(Long otpWindowStart) {
        this.otpWindowStart = otpWindowStart;
    }

    public long getTokenVersion() {
        return tokenVersion;
    }

    public void setTokenVersion(long tokenVersion) {
        this.tokenVersion = tokenVersion;
    }

    public VerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(VerificationStatus verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public String getVerificationLegalName() {
        return verificationLegalName;
    }

    public void setVerificationLegalName(String verificationLegalName) {
        this.verificationLegalName = verificationLegalName;
    }

    public String getVerificationDocumentType() {
        return verificationDocumentType;
    }

    public void setVerificationDocumentType(String verificationDocumentType) {
        this.verificationDocumentType = verificationDocumentType;
    }

    public String getVerificationDocumentNumber() {
        return verificationDocumentNumber;
    }

    public void setVerificationDocumentNumber(String verificationDocumentNumber) {
        this.verificationDocumentNumber = verificationDocumentNumber;
    }

    public byte[] getVerificationDocumentData() {
        return verificationDocumentData;
    }

    public void setVerificationDocumentData(byte[] verificationDocumentData) {
        this.verificationDocumentData = verificationDocumentData;
    }

    public String getVerificationDocumentContentType() {
        return verificationDocumentContentType;
    }

    public void setVerificationDocumentContentType(String verificationDocumentContentType) {
        this.verificationDocumentContentType = verificationDocumentContentType;
    }

    public String getVerificationDocumentFilename() {
        return verificationDocumentFilename;
    }

    public void setVerificationDocumentFilename(String verificationDocumentFilename) {
        this.verificationDocumentFilename = verificationDocumentFilename;
    }

    public String getVerificationDocumentUrl() {
        return verificationDocumentUrl;
    }

    public void setVerificationDocumentUrl(String verificationDocumentUrl) {
        this.verificationDocumentUrl = verificationDocumentUrl;
    }

    public String getVerificationDocumentPublicId() {
        return verificationDocumentPublicId;
    }

    public void setVerificationDocumentPublicId(String verificationDocumentPublicId) {
        this.verificationDocumentPublicId = verificationDocumentPublicId;
    }

    public java.time.Instant getVerificationSubmittedAt() {
        return verificationSubmittedAt;
    }

    public void setVerificationSubmittedAt(java.time.Instant verificationSubmittedAt) {
        this.verificationSubmittedAt = verificationSubmittedAt;
    }

    public java.time.Instant getVerificationReviewedAt() {
        return verificationReviewedAt;
    }

    public void setVerificationReviewedAt(java.time.Instant verificationReviewedAt) {
        this.verificationReviewedAt = verificationReviewedAt;
    }

    public java.time.Instant getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(java.time.Instant verifiedAt) {
        this.verifiedAt = verifiedAt;
    }

    public String getVerificationReviewedBy() {
        return verificationReviewedBy;
    }

    public void setVerificationReviewedBy(String verificationReviewedBy) {
        this.verificationReviewedBy = verificationReviewedBy;
    }

    public String getVerificationRejectionReason() {
        return verificationRejectionReason;
    }

    public void setVerificationRejectionReason(String verificationRejectionReason) {
        this.verificationRejectionReason = verificationRejectionReason;
    }
}