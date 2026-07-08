package com.studentpg.modules.pg.controller;

import com.studentpg.common.response.PagedResponse;
import com.studentpg.common.util.PageableUtils;
import com.studentpg.modules.pg.entity.PG;
import com.studentpg.modules.pg.service.PGService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/pgs")
@CrossOrigin(origins = "*")
public class PGController {

    @Autowired
    private PGService pgService;

    @GetMapping("/{id}")
    public PG getPGById(@PathVariable String id) {
        return pgService.getPGById(id);
    }

    @PostMapping
    public String addPG(@RequestBody PG pg) {
        return pgService.addPG(pg);
    }

    @GetMapping("/owner")
    public PagedResponse<PG> getOwnerPGs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Pageable pageable = PageableUtils.build(page, size, sortBy, direction);
        Page<PG> result = pgService.getOwnerPGs(pageable);

        return new PagedResponse<>(
                result.getContent(), result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages());
    }

    @PutMapping("/{id}")
    public String updatePG(@PathVariable String id, @RequestBody PG pg) {
        return pgService.updatePG(id, pg);
    }

    @DeleteMapping("/{id}")
    public String deletePG(@PathVariable String id) {
        return pgService.deletePG(id);
    }

    @PostMapping("/{pgId}/images")
    public String uploadImages(@PathVariable String pgId, @RequestParam("images") MultipartFile[] images) throws IOException {
        return pgService.uploadImages(pgId, images);
    }

    @DeleteMapping("/{pgId}/images")
    public String deleteImage(@PathVariable String pgId, @RequestParam String publicId) throws IOException {
        return pgService.deleteImage(pgId, publicId);
    }

    @PutMapping("/{pgId}/images")
    public String replaceImage(@PathVariable String pgId, @RequestParam String publicId,
                                @RequestParam("image") MultipartFile image) throws IOException {
        return pgService.replaceImage(pgId, publicId, image);
    }
}