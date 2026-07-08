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
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchService {

    @Autowired
    private MongoTemplate mongoTemplate;

    public Page<PG> search(String keyword, Pageable pageable) {

        if (keyword == null || keyword.trim().isEmpty()) {
            return Page.empty(pageable);
        }

        if (!InputSanitizer.isSafe(keyword)) {
            return Page.empty(pageable);
        }

        TextCriteria textCriteria = TextCriteria.forDefaultLanguage().matchingAny(keyword.trim());

        Query query = TextQuery.queryText(textCriteria).sortByScore();
        query.addCriteria(Criteria.where("approvalStatus").is("APPROVED"));
        query.with(pageable);

        List<PG> results = mongoTemplate.find(query, PG.class);

        Query countQuery = TextQuery.queryText(textCriteria);
        countQuery.addCriteria(Criteria.where("approvalStatus").is("APPROVED"));

        long total = mongoTemplate.count(countQuery, PG.class);

        return PageableExecutionUtils.getPage(results, pageable, () -> total);
    }
}