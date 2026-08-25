package com.studentpg.modules.admin.controller;

import com.studentpg.common.util.PageableUtils;
import com.studentpg.modules.admin.dto.request.RejectPGRequest;
import com.studentpg.modules.admin.service.AdminService;
import com.studentpg.modules.pg.entity.PG;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/pgs")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;


    public AdminController(
            AdminService adminService
    ) {

        this.adminService =
                adminService;
    }


    /*
     * =====================================================
     * GET PG LISTINGS BY STATUS
     * =====================================================
     *
     * GET /api/admin/pgs?status=ALL
     * GET /api/admin/pgs?status=PENDING
     * GET /api/admin/pgs?status=APPROVED
     * GET /api/admin/pgs?status=REJECTED
     */

    @GetMapping
public ResponseEntity<Page<PG>> getPGs(

        @RequestParam(defaultValue = "ALL")
        String status,

        @RequestParam(defaultValue = "0")
        int page,

        @RequestParam(defaultValue = "10")
        int size,

        @RequestParam(required = false)
        String sortBy,

        @RequestParam(defaultValue = "asc")
        String direction
) {

    Pageable pageable = PageableUtils.build(
            page,
            size,
            sortBy,
            direction
    );

    return ResponseEntity.ok(
            adminService.getAllPGsByStatus(
                    status,
                    pageable
            )
    );
} 


    /*
     * =====================================================
     * GET ADMIN STATISTICS
     * =====================================================
     *
     * GET /api/admin/pgs/stats
     */

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {

        return ResponseEntity.ok(

                adminService.getAdminStats()

        );
    }


    /*
     * =====================================================
     * GET PENDING PGs
     * =====================================================
     *
     * GET /api/admin/pgs/pending
     */
@GetMapping("/{id}")
public ResponseEntity<PG> getPGById(
        @PathVariable String id
) {

    return ResponseEntity.ok(
            adminService.getPGById(id)
    );
}



@DeleteMapping("/{id}")
public ResponseEntity<String> deletePG(
        @PathVariable String id
) {

    return ResponseEntity.ok(
            adminService.deletePG(id)
    );
}


   @GetMapping("/pending")
public ResponseEntity<Page<PG>> getPendingPGs(

        @RequestParam(defaultValue = "0")
        int page,

        @RequestParam(defaultValue = "10")
        int size,

        @RequestParam(required = false)
        String sortBy,

        @RequestParam(defaultValue = "asc")
        String direction

) {

    Pageable pageable = PageableUtils.build(
            page,
            size,
            sortBy,
            direction
    );

    return ResponseEntity.ok(
            adminService.getPendingPGs(pageable)
    );
}

    /*
     * =====================================================
     * APPROVE PG
     * =====================================================
     *
     * PATCH /api/admin/pgs/{id}/approve
     */

    @PatchMapping("/{id}/approve")
    public ResponseEntity<String> approvePG(

            @PathVariable
            String id

    ) {

        return ResponseEntity.ok(

                adminService.approvePG(
                        id
                )

        );
    }


    /*
     * =====================================================
     * REJECT PG
     * =====================================================
     *
     * PATCH /api/admin/pgs/{id}/reject
     *
     * Body:
     *
     * {
     *     "reason": "Required documents are missing"
     * }
     */

    @PatchMapping("/{id}/reject")
    public ResponseEntity<String> rejectPG(

            @PathVariable
            String id,

            @Valid
            @RequestBody
            RejectPGRequest request

    ) {

        return ResponseEntity.ok(

                adminService.rejectPG(

                        id,

                        request.getReason()

                )

        );
    }


    /*
     * =====================================================
     * PG SEARCH SUGGESTIONS
     * =====================================================
     *
     * GET /api/admin/pgs/suggestions?query=bhopal
     */


   @GetMapping("/suggestions")
public ResponseEntity<List<String>> getSearchSuggestions(

        @RequestParam
        String query

) {

    return ResponseEntity.ok(
            adminService.getSearchSuggestions(query)
    );
}
}