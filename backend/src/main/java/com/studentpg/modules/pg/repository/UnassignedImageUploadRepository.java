package com.studentpg.modules.pg.repository;

import com.studentpg.modules.pg.entity.UnassignedImageUpload;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UnassignedImageUploadRepository extends MongoRepository<UnassignedImageUpload, String> {

    Optional<UnassignedImageUpload> findByPublicId(String publicId);

    void deleteByPublicId(String publicId);

    boolean existsByPublicIdAndOwnerId(String publicId, String ownerId);
}
