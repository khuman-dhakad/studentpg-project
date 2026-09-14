package com.studentpg.modules.pg.entity;

import com.studentpg.modules.owner.entity.Owner;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.TextIndexed;
// import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.*;

import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;
import java.time.Instant;
import com.studentpg.modules.pg.entity.Gender;
import com.studentpg.modules.pg.entity.RoomType;
import com.studentpg.modules.pg.entity.Category;
import com.studentpg.modules.pg.entity.ApprovalStatus;
@Document(collection = "pgs")
@CompoundIndexes({
        @CompoundIndex(
                name = "status_city_idx",
                def = "{'approvalStatus': 1, 'city': 1}"
        ),
        @CompoundIndex(
                name = "status_gender_idx",
                def = "{'approvalStatus': 1, 'gender': 1}"
        ),
        @CompoundIndex(
                name = "status_rent_idx",
                def = "{'approvalStatus': 1, 'rent': 1}"
        )
})
public class PG {




    

    @Id
    private String id;

    @Indexed
    private String ownerId;

    // @DBRef
    private transient Owner owner;


    @Size(max=100)
    @NotBlank(message = "PG name is required")
    @TextIndexed(weight = 3)
    private String pgName;

    @Size(max=300)
    @NotBlank
    @TextIndexed(weight = 2)
    private String address;

    @Size(max=1000)
    @TextIndexed(weight = 1)
    private String description;

    @Size(max=80)
    @NotBlank
    @TextIndexed(weight = 2)
    private String city;

    @Size(max=80)
    @NotBlank
    private String state;

    @GeoSpatialIndexed(
            type = GeoSpatialIndexType.GEO_2DSPHERE,
            name = "pg_location_2dsphere_idx"
    )
    private GeoJsonPoint location;

    @Transient
    private Double latitude;

    @Transient
    private Double longitude;

    @NotBlank
    @Pattern(regexp="^[0-9]{6}$")
    private String pincode;
    @NotBlank
    private String landmark;
    @NotNull
    private Category category;

    @Positive
    @Indexed
    private BigDecimal rent;

    
    @PositiveOrZero
    private BigDecimal securityDeposit;
    @NotBlank
    private String noticePeriod;
    @NotNull
    private Gender gender;
    @NotNull
    private RoomType roomType; 


    /*
     * ============================================================
     * AMENITIES
     * ============================================================
     */

    private boolean foodAvailable;

    private boolean wifiAvailable;

    private boolean parkingAvailable;

    private boolean laundryAvailable;

    private boolean acAvailable;

    private boolean powerBackup;


    /*
     * ============================================================
     * APPROVAL
     * ============================================================
     */

    @NotNull
    @Indexed
private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;


private String rejectionReason;

private Instant rejectedAt;

private String rejectedBy;
 
private String approvedBy;

private Instant approvedAt;

private Instant submittedAt = Instant.now();
    /*
     * ============================================================
     * IMAGES
     * ============================================================
     */

    @Size(max=15)
    private List<PGImage> images = new ArrayList<>( );


    /*
     * ============================================================
     * CONSTRUCTOR
     * ============================================================
     */

    public PG() {
    }

 /*
 * ============================================================
 * APPROVAL
 * ============================================================
 */


    /*
     * ============================================================
     * GETTERS AND SETTERS
     * ============================================================
     */

    public Instant getSubmittedAt() {
    return submittedAt;
}
public void setSubmittedAt(Instant submittedAt) {
    this.submittedAt = submittedAt;
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

public java.time.Instant getApprovedAt() {
    return approvedAt;
}

public void setApprovedAt(java.time.Instant approvedAt) {
    this.approvedAt = approvedAt;
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


    public Owner getOwner() {
        return owner;
    }

    public void setOwner(Owner owner) {
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

    public GeoJsonPoint getLocation() {
        return location;
    }

    public void setLocation(GeoJsonPoint location) {
        this.location = location;
        if (location == null) {
            this.latitude = null;
            this.longitude = null;
            return;
        }
        this.longitude = location.getX();
        this.latitude = location.getY();
    }

    public Double getLatitude() {
        if (latitude != null) {
            return latitude;
        }
        if (location != null) {
            return location.getY();
        }
        return null;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
        if (this.latitude != null && this.longitude != null) {
            this.location = new GeoJsonPoint(this.longitude, this.latitude);
        } else if (this.latitude == null && this.longitude == null) {
            this.location = null;
        }
    }

    public Double getLongitude() {
        if (longitude != null) {
            return longitude;
        }
        if (location != null) {
            return location.getX();
        }
        return null;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
        if (this.latitude != null && this.longitude != null) {
            this.location = new GeoJsonPoint(this.longitude, this.latitude);
        } else if (this.latitude == null && this.longitude == null) {
            this.location = null;
        }
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }


    public String getLandmark() {
        return landmark;
    }

    public void setLandmark(String landmark) {
        this.landmark = landmark;
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

  

    /*
     * ============================================================
     * AMENITY GETTERS / SETTERS
     * ============================================================
     */

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


    /*
     * ============================================================
     * APPROVAL GETTER / SETTER
     * ============================================================
     */

  public ApprovalStatus getApprovalStatus() {
    return approvalStatus;
}

public void setApprovalStatus(ApprovalStatus approvalStatus) {
    this.approvalStatus = approvalStatus;
}


    /*
     * ============================================================
     * IMAGE GETTER / SETTER
     * ============================================================
     */

    public List<PGImage> getImages() {
        return images;
    }

    public void setImages(List<PGImage> images) {
        this.images = images;
    }



    
}