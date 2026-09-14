package com.studentpg.modules.publicapi.controller;

import com.studentpg.modules.student.dto.response.NearbyPGResponse;
import com.studentpg.modules.student.dto.response.PGDetailsResponse;
import com.studentpg.modules.student.service.StudentService;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/pg")
@RequiredArgsConstructor
@Validated
public class PublicPGController {

    private final StudentService studentService;

    @GetMapping("/{id}")
    public PGDetailsResponse getPublicPG(@PathVariable String id) {
        return studentService.getPGDetails(id);
    }

    @GetMapping("/nearby")
    public List<NearbyPGResponse> getNearbyPGs(
            @RequestParam @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90.")
            @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90.")
            double latitude,

            @RequestParam @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180.")
            @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180.")
            double longitude,

            @RequestParam @DecimalMin(value = "0.01", message = "Radius must be greater than 0.")
            @DecimalMax(value = "10.0", message = "Radius must be less than or equal to 10 km.")
            double radiusKm
    ) {
        return studentService.searchNearbyPGs(latitude, longitude, radiusKm);
    }

}
 