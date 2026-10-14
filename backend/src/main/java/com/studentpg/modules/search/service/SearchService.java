package com.studentpg.modules.search.service;

import com.studentpg.common.util.InputSanitizer;
import com.studentpg.modules.pg.entity.PG;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.data.mongodb.core.query.TextQuery;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchService {

    private static final int MAX_KEYWORD_LENGTH = 100;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Cacheable(
            value = "pgSearch",
            key = "#keyword.trim().toLowerCase() + '-' + #pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort",
            sync = true
    )
    public Page<PG> search(String keyword, Pageable pageable) {

        if (keyword == null || keyword.trim().isEmpty()) {
            return Page.empty(pageable);
        }

        String trimmedKeyword = keyword.trim();
        if (trimmedKeyword.length() > MAX_KEYWORD_LENGTH) {
            trimmedKeyword = trimmedKeyword.substring(0, MAX_KEYWORD_LENGTH).trim();
        }

        if (!InputSanitizer.isSafe(trimmedKeyword)) {
            return Page.empty(pageable);
        }

        TextCriteria textCriteria = TextCriteria.forDefaultLanguage().matchingAny(trimmedKeyword);

        Query query = TextQuery.queryText(textCriteria).sortByScore();
        query.addCriteria(Criteria.where("approvalStatus").is("APPROVED"));
        query.with(pageable);

        List<PG> results = mongoTemplate.find(query, PG.class);

        Query countQuery = TextQuery.queryText(textCriteria);
        countQuery.addCriteria(Criteria.where("approvalStatus").is("APPROVED"));

        return PageableExecutionUtils.getPage(
                results,
                pageable,
                () -> mongoTemplate.count(countQuery, PG.class)
        );
    }
}