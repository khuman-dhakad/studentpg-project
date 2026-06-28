package com.studentpg.model;

import java.util.ArrayList;
import java.util.List;

public class PGImage {

    private String publicId;
    private String url;

    public PGImage() {
    }

    public PGImage(String publicId, String url) {
        this.publicId = publicId;
        this.url = url;
    }

    public String getPublicId() {
        return publicId;
    }

    public void setPublicId(String publicId) {
        this.publicId = publicId;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}