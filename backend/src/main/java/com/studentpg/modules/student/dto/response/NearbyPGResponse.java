package com.studentpg.modules.student.dto.response;

import com.studentpg.modules.pg.entity.Category;
import com.studentpg.modules.pg.entity.Gender;
import com.studentpg.modules.pg.entity.PGImage;
import com.studentpg.modules.pg.entity.RoomType;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class NearbyPGResponse {

    private String id;
    private String pgName;
    private String address;
    private String city;
    private String state;
    private Category category;
    private BigDecimal rent;
    private Gender gender;
    private RoomType roomType;
    private Double latitude;
    private Double longitude;
    private BigDecimal distanceKm;
    private List<PGImage> images = new ArrayList<>();

    public NearbyPGResponse() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPgName() {
        return pgName;
    }

    public void setPgName(String pgName) {
        this.pgName = pgName;
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

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public void setCity(String city) {
        this.city = city;
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

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public BigDecimal getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(BigDecimal distanceKm) {
        this.distanceKm = distanceKm;
    }

    public List<PGImage> getImages() {
        return images;
    }

    public void setImages(List<PGImage> images) {
        this.images = images == null ? new ArrayList<>() : new ArrayList<>(images);
    }
}
