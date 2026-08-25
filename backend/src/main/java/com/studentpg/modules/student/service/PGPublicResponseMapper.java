package com.studentpg.modules.student.service;

import com.studentpg.modules.owner.entity.Owner;
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
        response.setRejectionReason(pg.getRejectionReason());
        response.setRejectedAt(pg.getRejectedAt());
        response.setRejectedBy(pg.getRejectedBy());
        response.setApprovedBy(pg.getApprovedBy());
        response.setApprovedAt(pg.getApprovedAt());
        response.setSubmittedAt(pg.getSubmittedAt());
        response.setImages(pg.getImages());

        if (owner != null) {
            response.setOwner(new OwnerSummaryResponse(
                    owner.getId(),
                    owner.getName(),
                    owner.getEmail(),
                    owner.getPhone(),
                    owner.getWhatsappNumber()
            ));
        }

        return response;
    }
}
