package com.studentpg.modules.student.dto.response;

import com.studentpg.modules.pg.entity.ApprovalStatus;
import com.studentpg.modules.pg.entity.Category;
import com.studentpg.modules.pg.entity.Gender;
import com.studentpg.modules.pg.entity.PGImage;
import com.studentpg.modules.pg.entity.RoomType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class PGDetailsResponse {

    private String id;
    private String ownerId;
    private OwnerSummaryResponse owner;
    private String pgName;
    private String description;
    private String address;
    private String landmark;
    private String city;
    private String state;
    private String pincode;
    private Category category;
    private BigDecimal rent;
    private BigDecimal securityDeposit;
    private String noticePeriod;
    private Gender gender;
    private RoomType roomType;
    private boolean foodAvailable;
    private boolean wifiAvailable;
    private boolean parkingAvailable;
    private boolean laundryAvailable;
    private boolean acAvailable;
    private boolean powerBackup;
    private ApprovalStatus approvalStatus;
    private String rejectionReason;
    private Instant rejectedAt;
    private String rejectedBy;
    private String approvedBy;
    private Instant approvedAt;
    private Instant submittedAt;
    private List<PGImage> images = new ArrayList<>();

    public PGDetailsResponse() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public OwnerSummaryResponse getOwner() {
        return owner;
    }

    public void setOwner(OwnerSummaryResponse owner) {
        this.owner = owner;
    }

    public String getPgName() {
        return pgName;
    }

    public void setPgName(String pgName) {
        this.pgName = pgName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getLandmark() {
        return landmark;
    }

    public void setLandmark(String landmark) {
        this.landmark = landmark;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public BigDecimal getRent() {
        return rent;
    }

    public void setRent(BigDecimal rent) {
        this.rent = rent;
    }

    public BigDecimal getSecurityDeposit() {
        return securityDeposit;
    }

    public void setSecurityDeposit(BigDecimal securityDeposit) {
        this.securityDeposit = securityDeposit;
    }

    public String getNoticePeriod() {
        return noticePeriod;
    }

    public void setNoticePeriod(String noticePeriod) {
        this.noticePeriod = noticePeriod;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public RoomType getRoomType() {
        return roomType;
    }

    public void setRoomType(RoomType roomType) {
        this.roomType = roomType;
    }

    public boolean isFoodAvailable() {
        return foodAvailable;
    }

    public void setFoodAvailable(boolean foodAvailable) {
        this.foodAvailable = foodAvailable;
    }

    public boolean isWifiAvailable() {
        return wifiAvailable;
    }

    public void setWifiAvailable(boolean wifiAvailable) {
        this.wifiAvailable = wifiAvailable;
    }

    public boolean isParkingAvailable() {
        return parkingAvailable;
    }

    public void setParkingAvailable(boolean parkingAvailable) {
        this.parkingAvailable = parkingAvailable;
    }

    public boolean isLaundryAvailable() {
        return laundryAvailable;
    }

    public void setLaundryAvailable(boolean laundryAvailable) {
        this.laundryAvailable = laundryAvailable;
    }

    public boolean isAcAvailable() {
        return acAvailable;
    }

    public void setAcAvailable(boolean acAvailable) {
        this.acAvailable = acAvailable;
    }

    public boolean isPowerBackup() {
        return powerBackup;
    }

    public void setPowerBackup(boolean powerBackup) {
        this.powerBackup = powerBackup;
    }

    public ApprovalStatus getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(ApprovalStatus approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public Instant getRejectedAt() {
        return rejectedAt;
    }

    public void setRejectedAt(Instant rejectedAt) {
        this.rejectedAt = rejectedAt;
    }

    public String getRejectedBy() {
        return rejectedBy;
    }

    public void setRejectedBy(String rejectedBy) {
        this.rejectedBy = rejectedBy;
    }

    public String getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(String approvedBy) {
        this.approvedBy = approvedBy;
    }

    public Instant getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(Instant approvedAt) {
        this.approvedAt = approvedAt;
    }

    public Instant getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(Instant submittedAt) {
        this.submittedAt = submittedAt;
    }

    public List<PGImage> getImages() {
        return images;
    }

    public void setImages(List<PGImage> images) {
        this.images = images == null ? new ArrayList<>() : new ArrayList<>(images);
    }
}
