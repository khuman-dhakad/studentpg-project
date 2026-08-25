package com.studentpg.modules.student.service;

import com.studentpg.modules.owner.entity.Owner;
import com.studentpg.modules.pg.entity.PG;
import com.studentpg.modules.student.dto.response.PGDetailsResponse;
import org.junit.jupiter.api.Test;

import com.studentpg.modules.student.dto.response.OwnerSummaryResponse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

class PGPublicResponseMapperTest {

    private final PGPublicResponseMapper mapper = new PGPublicResponseMapper();

    @Test
    void mapsOwnerSummaryWithoutSensitiveFields() {
        PG pg = new PG();
        pg.setId("pg-1");
        pg.setPgName("Sunset PG");
        pg.setCity("Bhopal");
        pg.setState("MP");
        pg.setOwnerId("owner-1");

        Owner owner = new Owner();
        owner.setId("owner-1");
        owner.setName("Thakur Nikhil");
        owner.setEmail("tn8673436@gmail.com");
        owner.setPhone("8604325848");
        owner.setWhatsappNumber("8604325848");
        owner.setPassword("secret");

        PGDetailsResponse response = mapper.toPublicResponse(pg, owner);

        assertNotNull(response);
        assertEquals("pg-1", response.getId());
        assertEquals("Sunset PG", response.getPgName());
        assertNotNull(response.getOwner());
        assertEquals("owner-1", response.getOwner().getId());
        assertEquals("Thakur Nikhil", response.getOwner().getName());
        assertEquals("tn8673436@gmail.com", response.getOwner().getEmail());
        assertEquals("8604325848", response.getOwner().getPhone());
        assertEquals("8604325848", response.getOwner().getWhatsappNumber());
        assertThrows(NoSuchMethodException.class, () -> OwnerSummaryResponse.class.getMethod("getPassword"));
    }
}
