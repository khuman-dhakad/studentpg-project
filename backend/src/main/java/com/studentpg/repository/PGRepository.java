package com.studentpg.repository;

import com.studentpg.model.PG;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PGRepository extends MongoRepository<PG, String> {
    // === Aapka Existing Code ===
    List<PG> findByOwnerId(String ownerId);
    boolean existsByIdAndOwnerId(String id, String ownerId);
    List<PG> findByApprovalStatus(String approvalStatus);
    java.util.Optional<PG> findByIdAndApprovalStatus(String id, String approvalStatus);
    List<PG> findByApprovalStatusAndCity(String approvalStatus, String city);
    List<PG> findByApprovalStatusAndGender(String approvalStatus, String gender);
    List<PG> findByApprovalStatusAndRentLessThanEqual(String approvalStatus, double rent);
    void deleteByIdAndOwnerId(String id, String ownerId);

    // === Naye Required Methods (Admin Panel Updates) ===
    
    // FIXED: Agar 'name' ya 'title' property reference match nahi ho rha, toh yeh raw MongoDB query crash rok degi
    // Note: Agar aapke model me field ka naam 'pgName' ya kuch aur hai, toh aap neeche 'name' ko usse replace kar sakte hain.
    @Query("{ 'name': { $regex: ?0, $options: 'i' } }")
    List<PG> findTop8ByNameContainingIgnoreCase(String name);

    // 2. Dashboard KPI counts ke liye
    long countByApprovalStatus(String approvalStatus);
}