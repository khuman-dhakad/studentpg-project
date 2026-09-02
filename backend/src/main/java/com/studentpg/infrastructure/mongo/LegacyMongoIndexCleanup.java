package com.studentpg.infrastructure.mongo;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.IndexInfo;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class LegacyMongoIndexCleanup implements ApplicationRunner {

    private static final String PG_COLLECTION = "pgs";
    private static final String LEGACY_OWNER_EMAIL_INDEX = "owner.email";

    private final MongoTemplate mongoTemplate;

    public LegacyMongoIndexCleanup(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        List<IndexInfo> indexes = mongoTemplate.indexOps(PG_COLLECTION).getIndexInfo();
        boolean legacyIndexExists = indexes.stream()
                .anyMatch(index -> LEGACY_OWNER_EMAIL_INDEX.equals(index.getName()));

        if (legacyIndexExists) {
            mongoTemplate.indexOps(PG_COLLECTION).dropIndex(LEGACY_OWNER_EMAIL_INDEX);
        }
    }
}