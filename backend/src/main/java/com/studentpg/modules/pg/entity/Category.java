package com.studentpg.modules.pg.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import java.util.Locale;

public enum Category {

    BOYS,
    GIRLS,
    CO_LIVING,
    HOSTEL;

    @JsonCreator
    public static Category parse(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String normalized = value.trim().toUpperCase(Locale.ROOT)
                .replace('-', '_')
                .replace(' ', '_');

        if ("STANDARD".equals(normalized) || "STANDARD_BUDGET".equals(normalized)) {
            return HOSTEL;
        }

        if ("PREMIUM".equals(normalized) || "LUXURY".equals(normalized) || "LUXURY_ELITE".equals(normalized)) {
            return CO_LIVING;
        }

        for (Category category : values()) {
            if (category.name().equals(normalized)) {
                return category;
            }
        }

        try {
            return Category.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }
}
