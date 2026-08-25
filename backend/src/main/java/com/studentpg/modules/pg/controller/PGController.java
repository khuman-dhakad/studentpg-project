package com.studentpg.modules.pg.controller;

import com.studentpg.common.response.MessageResponse;
import com.studentpg.common.response.PagedResponse;
import com.studentpg.common.util.PageableUtils;
import com.studentpg.modules.pg.entity.PG;
import com.studentpg.modules.pg.entity.PGImage;
import com.studentpg.modules.pg.service.PGService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/owner/pgs")
@RequiredArgsConstructor
public class PGController {

    private final PGService pgService;

    /*
     * ============================================================
     * OWNER: GET SINGLE PG
     * ============================================================
     */
    @GetMapping("/{id}")
    public ResponseEntity<PG> getPGById(
            @PathVariable String id
    ) {
        return ResponseEntity.ok(
                pgService.getPGByIdForOwner(id)
        );
    }

    /*
     * ============================================================
     * OWNER: CREATE PG
     * ============================================================
     */
    @PostMapping
    public ResponseEntity<MessageResponse> addPG(
            @Valid @RequestBody PG pg
    ) {
        String message = pgService.addPG(pg);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MessageResponse(true, message));
    }

    /*
     * ============================================================
     * OWNER: GET OWN PG LISTINGS
     * ============================================================
     */
    @GetMapping
    public PagedResponse<PG> getOwnerPGs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Pageable pageable = PageableUtils.build(
                page,
                size,
                sortBy,
                direction
        );

        Page<PG> result = pgService.getOwnerPGs(pageable);

        return new PagedResponse<>(
                result.getContent(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages()
        );
    }

    /*
     * ============================================================
     * OWNER: UPDATE PG
     * ============================================================
     */
    @PutMapping("/{id}")
    public ResponseEntity<MessageResponse> updatePG(
            @PathVariable String id,
            @Valid @RequestBody PG pg
    ) {
        String message = pgService.updatePG(id, pg);
        return ResponseEntity.ok(
                new MessageResponse(true, message)
        );
    }

    /*
     * ============================================================
     * OWNER: DELETE PG
     * ============================================================
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deletePG(
            @PathVariable String id
    ) {
        String message = pgService.deletePG(id);
        return ResponseEntity.ok(
                new MessageResponse(true, message)
        );
    }

    /*
     * ============================================================
     * OWNER: UPLOAD STANDALONE IMAGE
     * ============================================================
     */
    @PostMapping(
            value = "/images/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<PGImage> uploadStandaloneImage(
            @RequestParam("image") MultipartFile image
    ) throws IOException {
        return ResponseEntity.ok(
                pgService.uploadSingleImage(image)
        );
    }

    /*
     * ============================================================
     * OWNER: UPLOAD IMAGES
     * ============================================================
     */
    @PostMapping(
            value = "/{pgId}/images",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<MessageResponse> uploadImages(
            @PathVariable String pgId,
            @RequestParam("images") MultipartFile[] images
    ) throws IOException {
        String message = pgService.uploadImages(pgId, images);
        return ResponseEntity.ok(
                new MessageResponse(true, message)
        );
    }

    /*
     * ============================================================
     * OWNER: DELETE IMAGE
     * ============================================================
     */
    @DeleteMapping("/{pgId}/images")
    public ResponseEntity<MessageResponse> deleteImage(
            @PathVariable String pgId,
            @RequestParam String publicId
    ) throws IOException {
        String message = pgService.deleteImage(pgId, publicId);
        return ResponseEntity.ok(
                new MessageResponse(true, message)
        );
    }

    /*
     * ============================================================
     * OWNER: REPLACE IMAGE
     * ============================================================
     */
    @PutMapping(
            value = "/{pgId}/images",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<MessageResponse> replaceImage(
            @PathVariable String pgId,
            @RequestParam String publicId,
            @RequestParam("image") MultipartFile image
    ) throws IOException {
        String message = pgService.replaceImage(pgId, publicId, image);
        return ResponseEntity.ok(
                new MessageResponse(true, message)
        );
    }
}