package com.studentpg.modules.student.service;

import com.studentpg.modules.owner.entity.Owner;
import com.studentpg.modules.owner.entity.VerificationStatus;
import com.studentpg.modules.pg.entity.PG;
import com.studentpg.modules.student.dto.response.OwnerSummaryResponse;
import com.studentpg.modules.student.dto.response.PGDetailsResponse;
import org.springframework.stereotype.Component;

@Component
public class PGPublicResponseMapper {

    public PGDetailsResponse toPublicResponse(PG pg, Owner owner) {
        PGDetailsResponse response = new PGDetailsResponse();
        response.setId(pg.getId());
        response.setOwnerId(pg.getOwnerId());
        response.setPgName(pg.getPgName());
        response.setDescription(pg.getDescription());
        response.setAddress(pg.getAddress());
        response.setLandmark(pg.getLandmark());
        response.setCity(pg.getCity());
        response.setState(pg.getState());
        response.setPincode(pg.getPincode());
        response.setCategory(pg.getCategory());
        response.setRent(pg.getRent());
        response.setSecurityDeposit(pg.getSecurityDeposit());
        response.setNoticePeriod(pg.getNoticePeriod());
        response.setGender(pg.getGender());
        response.setRoomType(pg.getRoomType());
        response.setFoodAvailable(pg.isFoodAvailable());
        response.setWifiAvailable(pg.isWifiAvailable());
        response.setParkingAvailable(pg.isParkingAvailable());
        response.setLaundryAvailable(pg.isLaundryAvailable());
        response.setAcAvailable(pg.isAcAvailable());
        response.setPowerBackup(pg.isPowerBackup());
        response.setApprovalStatus(pg.getApprovalStatus());
        // SECURITY REMEDIATION: Admin email and internal moderation audit details
        // must NEVER be exposed in public student endpoints.
        response.setRejectionReason(null);
        response.setRejectedAt(null);
        response.setRejectedBy(null);
        response.setApprovedBy(null);
        response.setApprovedAt(null);
        response.setSubmittedAt(pg.getSubmittedAt());
        response.setImages(pg.getImages());

        if (owner != null) {
            String phone = owner.getPhone();
            String whatsappNumber = owner.getWhatsappNumber();
            if (whatsappNumber == null || whatsappNumber.isBlank()) {
                whatsappNumber = phone;
            }

            response.setOwner(new OwnerSummaryResponse(
                    owner.getId(),
                    owner.getName(),
                    owner.getEmail(),
                    phone,
                    whatsappNumber,
                        owner.getVerificationStatus() == VerificationStatus.VERIFIED
            ));
        }

        return response;
    }

    public static PG sanitizePGForPublic(PG pg) {
        if (pg == null) {
            return null;
        }
        PG copy = new PG();
        copy.setId(pg.getId());
        copy.setOwnerId(pg.getOwnerId());
        copy.setPgName(pg.getPgName());
        copy.setAddress(pg.getAddress());
        copy.setDescription(pg.getDescription());
        copy.setCity(pg.getCity());
        copy.setState(pg.getState());
        copy.setLocation(pg.getLocation());
        copy.setLatitude(pg.getLatitude());
        copy.setLongitude(pg.getLongitude());
        copy.setPincode(pg.getPincode());
        copy.setLandmark(pg.getLandmark());
        copy.setCategory(pg.getCategory());
        copy.setRent(pg.getRent());
        copy.setSecurityDeposit(pg.getSecurityDeposit());
        copy.setNoticePeriod(pg.getNoticePeriod());
        copy.setGender(pg.getGender());
        copy.setRoomType(pg.getRoomType());
        copy.setFoodAvailable(pg.isFoodAvailable());
        copy.setWifiAvailable(pg.isWifiAvailable());
        copy.setParkingAvailable(pg.isParkingAvailable());
        copy.setLaundryAvailable(pg.isLaundryAvailable());
        copy.setAcAvailable(pg.isAcAvailable());
        copy.setPowerBackup(pg.isPowerBackup());
        copy.setApprovalStatus(pg.getApprovalStatus());
        copy.setSubmittedAt(pg.getSubmittedAt());
        copy.setImages(pg.getImages());
        // SECURITY NOTE: admin and moderation audit fields (approvedBy, approvedAt, rejectedBy, rejectedAt, rejectionReason)
        // are intentionally omitted (null) to prevent leaking administrator email and internal notes to public consumers.
        return copy;
    }
}
