package com.studentpg.repository;

import com.studentpg.model.PG;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PGRepository extends MongoRepository<PG, String> {
    List<PG> findByOwnerId(String ownerId);
    boolean existsByIdAndOwnerId(String id, String ownerId);
    List<PG> findByApprovalStatus(String approvalStatus);
    java.util.Optional<PG> findByIdAndApprovalStatus(String id, String approvalStatus);
    List<PG> findByApprovalStatusAndCity(String approvalStatus, String city);
    void deleteByIdAndOwnerId(String id, String ownerId);
}