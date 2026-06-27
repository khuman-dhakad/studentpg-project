package com.studentpg.service;

import com.studentpg.model.PG;
import com.studentpg.repository.PGRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private PGRepository pgRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public List<PG> getApprovedPGs() {
        return pgRepository.findByApprovalStatus("APPROVED");
    }
    public PG getPGDetails(String id) {

    return pgRepository
            .findByIdAndApprovalStatus(id, "APPROVED")
            .orElse(null);
    }
    public List<PG> searchByCity(String city) {
    return pgRepository.findByApprovalStatusAndCity("APPROVED", city);
   }
   public List<PG> filterByGender(String gender) {
    return pgRepository.findByApprovalStatusAndGender("APPROVED", gender);
   }
   public List<PG> filterByRent(double rent) {
    return pgRepository.findByApprovalStatusAndRentLessThanEqual("APPROVED", rent);
   }
   public List<PG> filterPGs(
        String city,
        String category,
        Double maxRent,
        Boolean food,
        Boolean wifi,
        Boolean parking,
        Boolean laundry,
        String roomType) {

    Query query = new Query();

    query.addCriteria(Criteria.where("approvalStatus").is("APPROVED"));

    if (city != null)
        query.addCriteria(Criteria.where("city").is(city));

    if (category != null)
        query.addCriteria(Criteria.where("gender").is(category));

    if (maxRent != null)
        query.addCriteria(Criteria.where("rent").lte(maxRent));

    if (food != null)
        query.addCriteria(Criteria.where("foodAvailable").is(food));

    if (wifi != null)
        query.addCriteria(Criteria.where("wifiAvailable").is(wifi));

    if (parking != null)
        query.addCriteria(Criteria.where("parkingAvailable").is(parking));

    if (laundry != null)
        query.addCriteria(Criteria.where("laundryAvailable").is(laundry));

    if (roomType != null)
        query.addCriteria(Criteria.where("roomType").is(roomType));

    return mongoTemplate.find(query, PG.class);
}
}