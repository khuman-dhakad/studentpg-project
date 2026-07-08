package com.studentpg.modules.student.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PGSuggestionResponse {

    @JsonProperty("_id")
    private String id;

    private String pgName;
    private String city;

    public PGSuggestionResponse() {
    }

    public PGSuggestionResponse(String id, String pgName, String city) {
        this.id = id;
        this.pgName = pgName;
        this.city = city;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPgName() { return pgName; }
    public void setPgName(String pgName) { this.pgName = pgName; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
}