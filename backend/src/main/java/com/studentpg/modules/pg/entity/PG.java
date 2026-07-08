package com.studentpg.modules.pg.entity;

import com.studentpg.modules.owner.entity.Owner;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "pgs")
@CompoundIndexes({
        @CompoundIndex(name = "status_city_idx", def = "{'approvalStatus': 1, 'city': 1}"),
        @CompoundIndex(name = "status_gender_idx", def = "{'approvalStatus': 1, 'gender': 1}"),
        @CompoundIndex(name = "status_rent_idx", def = "{'approvalStatus': 1, 'rent': 1}")
})
public class PG {

    @Id
    private String id;

    @Indexed
    private String ownerId;

    @DBRef
    private Owner owner;

    @TextIndexed(weight = 3)
    private String pgName;

    @TextIndexed(weight = 1)
    private String description;

    private String address;

    @TextIndexed(weight = 2)
    private String city;

    private String state;
    private String pincode;

    @Indexed
    private double rent;

    private String gender;
    private String roomType;

    private boolean foodAvailable;
    private boolean wifiAvailable;
    private boolean parkingAvailable;
    private boolean laundryAvailable;

    @Indexed
    private String approvalStatus;

    private List<PGImage> images = new ArrayList<>();

    public PG() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }
    public Owner getOwner() { return owner; }
    public void setOwner(Owner owner) { this.owner = owner; }
    public String getPgName() { return pgName; }
    public void setPgName(String pgName) { this.pgName = pgName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    public double getRent() { return rent; }
    public void setRent(double rent) { this.rent = rent; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }
    public boolean isFoodAvailable() { return foodAvailable; }
    public void setFoodAvailable(boolean foodAvailable) { this.foodAvailable = foodAvailable; }
    public boolean isWifiAvailable() { return wifiAvailable; }
    public void setWifiAvailable(boolean wifiAvailable) { this.wifiAvailable = wifiAvailable; }
    public boolean isParkingAvailable() { return parkingAvailable; }
    public void setParkingAvailable(boolean parkingAvailable) { this.parkingAvailable = parkingAvailable; }
    public boolean isLaundryAvailable() { return laundryAvailable; }
    public void setLaundryAvailable(boolean laundryAvailable) { this.laundryAvailable = laundryAvailable; }
    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }
    public List<PGImage> getImages() { return images; }
    public void setImages(List<PGImage> images) { this.images = images; }
}