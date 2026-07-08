package com.studentpg.modules.student.service;

import com.studentpg.modules.pg.entity.PG;
import com.studentpg.modules.pg.repository.PGRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.support.PageableExecutionUtils;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private PGRepository pgRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Cacheable(value = "approvedPgs", key = "#pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort")
    public Page<PG> getApprovedPGs(Pageable pageable) {
        return pgRepository.findByApprovalStatus("APPROVED", pageable);
    }

    public PG getPGDetails(String id) {
        return pgRepository.findByIdAndApprovalStatus(id, "APPROVED").orElse(null);
    }

    public Page<PG> searchByCity(String city, Pageable pageable) {
        return pgRepository.findByApprovalStatusAndCity("APPROVED", city, pageable);
    }

    public Page<PG> filterByGender(String gender, Pageable pageable) {
        return pgRepository.findByApprovalStatusAndGender("APPROVED", gender, pageable);
    }

    public Page<PG> filterByRent(double rent, Pageable pageable) {
        return pgRepository.findByApprovalStatusAndRentLessThanEqual("APPROVED", rent, pageable);
    }
    public List<PG> getSearchSuggestions(String query) {
        if (query == null || query.trim().length() < 2) {
    return List.of();
}

    query = query.trim();

    Query mongoQuery = new Query();

    mongoQuery.addCriteria(
            Criteria.where("approvalStatus").is("APPROVED")
                    .orOperator(
                            Criteria.where("pgName").regex("^" + query, "i"),
                            Criteria.where("city").regex("^" + query, "i")
                    )
    );

    mongoQuery.limit(8);

    return mongoTemplate.find(mongoQuery, PG.class);
}

    public Page<PG> filterPGs(String city, String category, Double maxRent, Boolean food,
                               Boolean wifi, Boolean parking, Boolean laundry, String roomType,
                               Pageable pageable) {

        Query query = new Query().with(pageable);
        query.addCriteria(Criteria.where("approvalStatus").is("APPROVED"));

        if (city != null) query.addCriteria(Criteria.where("city").is(city));
        if (category != null) query.addCriteria(Criteria.where("gender").is(category));
        if (maxRent != null) query.addCriteria(Criteria.where("rent").lte(maxRent));
        if (food != null) query.addCriteria(Criteria.where("foodAvailable").is(food));
        if (wifi != null) query.addCriteria(Criteria.where("wifiAvailable").is(wifi));
        if (parking != null) query.addCriteria(Criteria.where("parkingAvailable").is(parking));
        if (laundry != null) query.addCriteria(Criteria.where("laundryAvailable").is(laundry));
        if (roomType != null) query.addCriteria(Criteria.where("roomType").is(roomType));

        List<PG> results = mongoTemplate.find(query, PG.class);

        Query countQuery = Query.of(query).limit(-1).skip(-1);
        long total = mongoTemplate.count(countQuery, PG.class);

        return PageableExecutionUtils.getPage(results, pageable, () -> total);
    }
}