package com.studentpg.controller;

import com.studentpg.model.PG;
import com.studentpg.service.PGService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/pgs")
@CrossOrigin(origins = "*") // CORS Error block filter fix karne ke liye add kiya
public class PGController {

    @Autowired
    private PGService pgService;

    // ==========================================
    // FIXED/ADDED ENDPOINT: Yeh dynamic ID lekar PGService ko connect karega
    // ==========================================
    @GetMapping("/{id}")
    public PG getPGById(@PathVariable String id) {
        return pgService.getPGById(id);
    }

    @PostMapping
    public String addPG(@RequestBody PG pg) {
        return pgService.addPG(pg);
    }

    @GetMapping("/owner")
    public List<PG> getOwnerPGs() {
        return pgService.getOwnerPGs();
    }

    @PutMapping("/{id}")
    public String updatePG(@PathVariable String id,
                           @RequestBody PG pg) {

        return pgService.updatePG(id, pg);
    }

    @DeleteMapping("/{id}")
    public String deletePG(@PathVariable String id) {

        return pgService.deletePG(id);
    }

    @PostMapping("/{pgId}/images")
    public String uploadImages(@PathVariable String pgId,
                               @RequestParam("images") MultipartFile[] images)
            throws IOException {

        return pgService.uploadImages(pgId, images);
    }

    @DeleteMapping("/{pgId}/images")
    public String deleteImage(@PathVariable String pgId,
                              @RequestParam String publicId)
            throws IOException {

        return pgService.deleteImage(pgId, publicId);
    }

    @PutMapping("/{pgId}/images")
    public String replaceImage(@PathVariable String pgId,
                               @RequestParam String publicId,
                               @RequestParam("image") MultipartFile image)
            throws IOException {

        return pgService.replaceImage(pgId, publicId, image);
    }
}