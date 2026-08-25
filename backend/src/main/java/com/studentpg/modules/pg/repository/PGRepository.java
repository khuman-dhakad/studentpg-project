package com.studentpg.modules.pg.repository;

// import com.studentpg.modules.pg.entity.ApprovalStatus;
import com.studentpg.modules.pg.entity.PG;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import org.springframework.stereotype.Repository;
import java.math.BigDecimal;

import java.util.List;
import java.util.Optional;
import com.studentpg.modules.pg.entity.ApprovalStatus;
import com.studentpg.modules.pg.entity.Gender;

@Repository
public interface PGRepository
        extends MongoRepository<PG, String> {


    /*
     * ============================================================
     * OWNER QUERIES
     * ============================================================
     */

    List<PG> findByOwnerId(
            String ownerId
    );


    Page<PG> findByOwnerId(
            String ownerId,
            Pageable pageable
    );


    boolean existsByIdAndOwnerId(
            String id,
            String ownerId
    );


    /*
     * ============================================================
     * APPROVAL STATUS
     * ============================================================
     */

    List<PG> findByApprovalStatus(
ApprovalStatus approvalStatus
);


    Page<PG> findByApprovalStatus(
            ApprovalStatus approvalStatus,
            Pageable pageable
    );


    Optional<PG> findByIdAndApprovalStatus(
            String id,
            ApprovalStatus approvalStatus
    );


    /*
     * ============================================================
     * FILTERING
     * ============================================================
     */

    Page<PG> findByApprovalStatusAndCity(
            ApprovalStatus approvalStatus,
            String city,
            Pageable pageable
    );


    Page<PG> findByApprovalStatusAndGender(
            ApprovalStatus approvalStatus,
            Gender gender,
            Pageable pageable
    );


    Page<PG> findByApprovalStatusAndRentLessThanEqual(
            ApprovalStatus approvalStatus,
            BigDecimal rent,
            Pageable pageable
    );


    /*
     * ============================================================
     * OWNER DELETE
     * ============================================================
     */

    void deleteByIdAndOwnerId(
            String id,
            String ownerId
    );


    /*
     * ============================================================
     * ADMIN SEARCH SUGGESTIONS
     * ============================================================
     *
     * PG entity field:
     *
     * private String pgName;
     *
     */

//     @Query(
//             "{ 'pgName': { $regex: ?0, $options: 'i' } }"
//     )
  List<PG> findTop8ByApprovalStatusAndPgNameContainingIgnoreCase(
        ApprovalStatus approvalStatus,
        String pgName
);


    /*
     * ============================================================
     * ADMIN STATISTICS
     * ============================================================
     */

    long countByApprovalStatus(
            ApprovalStatus approvalStatus
    );
}