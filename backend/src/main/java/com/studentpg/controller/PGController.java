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
public class PGController {

    @Autowired
    private PGService pgService;

    @PostMapping
    public String addPG(@RequestBody PG pg) {
        return pgService.addPG(pg);
    }

    @GetMapping("/owner/{ownerId}")
    public List<PG> getOwnerPGs(@PathVariable String ownerId) {
        return pgService.getOwnerPGs(ownerId);
    }

    @PutMapping("/{id}/{ownerId}")
    public String updatePG(@PathVariable String id,
                           @PathVariable String ownerId,
                           @RequestBody PG pg) {

        return pgService.updatePG(id, ownerId, pg);
    }

    @DeleteMapping("/{id}/{ownerId}")
    public String deletePG(@PathVariable String id,
                           @PathVariable String ownerId) {

        return pgService.deletePG(id, ownerId);
    }

    @PostMapping("/{pgId}/images")
    public String uploadImages(@PathVariable String pgId,
                               @RequestParam("images") MultipartFile[] images) throws IOException {

        return pgService.uploadImages(pgId, images);
    }
    @DeleteMapping("/{pgId}/images")
    public String deleteImage(@PathVariable String pgId,
                          @RequestParam String publicId) throws IOException {

    return pgService.deleteImage(pgId, publicId);
    }
    @PutMapping("/{pgId}/images")
    public String replaceImage(@PathVariable String pgId,
                           @RequestParam String publicId,
                           @RequestParam("image") MultipartFile image) throws IOException {

    return pgService.replaceImage(pgId, publicId, image);
    }
}