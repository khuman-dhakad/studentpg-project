package com.studentpg.modules.pg.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import java.util.Locale;

public enum RoomType {

    SINGLE,
    DOUBLE,
    TRIPLE,
    FOUR_SHARING;

    @JsonCreator
    public static RoomType parse(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String normalized = value.trim().toUpperCase(Locale.ROOT)
                .replace('-', '_')
                .replace(' ', '_');

        if (normalized.startsWith("SINGLE")) {
            return SINGLE;
        }

        if (normalized.startsWith("DOUBLE")) {
            return DOUBLE;
        }

        if (normalized.startsWith("TRIPLE")) {
            return TRIPLE;
        }

        if (normalized.startsWith("FOUR") || normalized.startsWith("4")) {
            return FOUR_SHARING;
        }

        for (RoomType roomType : values()) {
            if (roomType.name().equals(normalized)) {
                return roomType;
            }
        }

        try {
            return RoomType.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }
}
