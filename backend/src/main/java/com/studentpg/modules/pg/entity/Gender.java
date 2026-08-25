package com.studentpg.modules.pg.entity;

import java.util.Locale;

public enum Gender {

    MALE,
    FEMALE,
    UNISEX;

    public static Gender parse(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String normalized = value.trim().toUpperCase(Locale.ROOT);

        if ("FAMILY".equals(normalized)) {
            return UNISEX;
        }

        if ("BOYS".equals(normalized) || "BOY".equals(normalized)) {
            return MALE;
        }

        if ("GIRLS".equals(normalized) || "GIRL".equals(normalized)) {
            return FEMALE;
        }

        try {
            return Gender.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }
}