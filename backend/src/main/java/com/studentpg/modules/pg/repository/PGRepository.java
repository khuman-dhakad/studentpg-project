package com.studentpg.modules.pg.repository;

import com.studentpg.modules.pg.entity.PG;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PGRepository extends MongoRepository<PG, String> {

    List<PG> findByOwnerId(String ownerId);
    Page<PG> findByOwnerId(String ownerId, Pageable pageable);

    boolean existsByIdAndOwnerId(String id, String ownerId);

    List<PG> findByApprovalStatus(String approvalStatus);
    Page<PG> findByApprovalStatus(String approvalStatus, Pageable pageable);

    java.util.Optional<PG> findByIdAndApprovalStatus(String id, String approvalStatus);

    Page<PG> findByApprovalStatusAndCity(String approvalStatus, String city, Pageable pageable);
    Page<PG> findByApprovalStatusAndGender(String approvalStatus, String gender, Pageable pageable);
    Page<PG> findByApprovalStatusAndRentLessThanEqual(String approvalStatus, double rent, Pageable pageable);

    void deleteByIdAndOwnerId(String id, String ownerId);

    @Query("{ 'pgName': { $regex: ?0, $options: 'i' } }")
    List<PG> findTop8ByNameContainingIgnoreCase(String name);

    long countByApprovalStatus(String approvalStatus);
}