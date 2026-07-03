package com.studentpg.repository;

import com.studentpg.model.PG;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PGRepository extends MongoRepository<PG, String> {
    List<PG> findByOwnerId(String ownerId);
    boolean existsByIdAndOwnerId(String id, String ownerId);
    List<PG> findByApprovalStatus(String approvalStatus);
    java.util.Optional<PG> findByIdAndApprovalStatus(String id, String approvalStatus);
    List<PG> findByApprovalStatusAndCity(String approvalStatus, String city);
    List<PG> findByApprovalStatusAndGender(String approvalStatus, String gender);
    List<PG> findByApprovalStatusAndRentLessThanEqual(String approvalStatus, double rent);
    void deleteByIdAndOwnerId(String id, String ownerId);

    @Query("{ 'pgName': { $regex: ?0, $options: 'i' } }")
    List<PG> findTop8ByNameContainingIgnoreCase(String name);

    long countByApprovalStatus(String approvalStatus);
}