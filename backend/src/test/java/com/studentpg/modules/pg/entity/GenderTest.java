package com.studentpg.modules.pg.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class GenderTest {

    @Test
    void shouldNormalizeLegacyGenderValues() {
        assertEquals(Gender.MALE, Gender.parse("male"));
        assertEquals(Gender.FEMALE, Gender.parse("female"));
        assertEquals(Gender.UNISEX, Gender.parse("Family"));
        assertEquals(Gender.UNISEX, Gender.parse("Unisex"));
    }
}
