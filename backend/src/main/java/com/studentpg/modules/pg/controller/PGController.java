package com.studentpg.modules.pg.controller;

import com.studentpg.common.response.MessageResponse;
import com.studentpg.common.response.PagedResponse;
import com.studentpg.common.util.PageableUtils;
import com.studentpg.modules.pg.entity.PG;
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
@CrossOrigin(
        origins = "${app.frontend.url}",
        allowCredentials = "true"
)
@RequiredArgsConstructor
public class PGController {

private final PGService pgService;


    /*
     * ============================================================
     * OWNER: GET SINGLE PG
     * ============================================================
     *
     * Only the authenticated owner who owns this PG can access it.
     *
     * GET /api/pgs/{id}
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
     *
     * Only the authenticated owner can create a PG.
     * POST /api/pgs
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
     *
     * GET /api/pgs/owner
     */
    @GetMapping
    public PagedResponse<PG> getOwnerPGs(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(required = false)
            String sortBy,

            @RequestParam(defaultValue = "asc")
            String direction
    ) {

        Pageable pageable =
                PageableUtils.build(
                        page,
                        size,
                        sortBy,
                        direction
                );

        Page<PG> result =
                pgService.getOwnerPGs(pageable);

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
     *
     * PUT /api/pgs/{id}
     */
//     @PutMapping("/{id}")
//     public String updatePG(

//             @PathVariable String id,

//             @Valid
//                 @RequestBody PG pg
//     ) {

//         return pgService.updatePG(id, pg);
//     }
@PutMapping("/{id}")
public ResponseEntity<String> updatePG(
        @PathVariable String id,
        @Valid @RequestBody PG pg
) {
    return ResponseEntity.ok(
            pgService.updatePG(id, pg)
    );
}


    /*
     * ============================================================
     * OWNER: DELETE PG
     * ============================================================
     *
     * DELETE /api/pgs/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String>  deletePG(

            @PathVariable String id
    ) {

        return ResponseEntity.ok(
                pgService.deletePG(id)
        );
    }


    /*
     * ============================================================
     * OWNER: UPLOAD IMAGES
     * ============================================================
     *
     * POST /api/pgs/{pgId}/images
     */
    @PostMapping(
            value = "/{pgId}/images",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> uploadImages(

            @PathVariable String pgId,

            @RequestParam("images")
            MultipartFile[] images

    ) throws IOException {

         return ResponseEntity.ok(
                pgService.uploadImages(
                        pgId,
                        images
                )
        );
    }   


    /*
     * ============================================================
     * OWNER: DELETE IMAGE
     * ============================================================
     *
     * DELETE /api/pgs/{pgId}/images?publicId=...
     */
    @DeleteMapping("/{pgId}/images")
    public ResponseEntity<String> deleteImage(

            @PathVariable String pgId,

            @RequestParam
            String publicId

    ) throws IOException {

        return ResponseEntity.ok(
                pgService.deleteImage(
                        pgId,
                        publicId
                )
        );
    }


    /*
     * ============================================================
     * OWNER: REPLACE IMAGE
     * ============================================================
     *
     * PUT /api/pgs/{pgId}/images
     */
    @PutMapping(
            value = "/{pgId}/images",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> replaceImage(

            @PathVariable String pgId,

            @RequestParam
            String publicId,

            @RequestParam("image")
            MultipartFile image

    ) throws IOException {

         return ResponseEntity.ok(
                pgService.replaceImage(
                        pgId,
                        publicId,
                        image
                )
        );
    }
}