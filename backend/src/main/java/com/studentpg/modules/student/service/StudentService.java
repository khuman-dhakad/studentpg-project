package com.studentpg.modules.student.service;

import com.studentpg.modules.owner.entity.Owner;
import com.studentpg.modules.owner.repository.OwnerRepository;
import com.studentpg.modules.pg.entity.ApprovalStatus;
import com.studentpg.modules.pg.entity.Gender;
import com.studentpg.modules.pg.entity.PG;
import com.studentpg.modules.pg.repository.PGRepository;
import com.studentpg.modules.student.dto.response.PGDetailsResponse;
import com.studentpg.modules.student.dto.response.PGSuggestionResponse;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.NearQuery;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;



@Service
public class StudentService {

    public static final double MAX_NEARBY_RADIUS_KM = 10.0;
    public static final int MAX_NEARBY_RESULTS = 20;

    private final PGRepository pgRepository;
    private final MongoTemplate mongoTemplate;
    private final OwnerRepository ownerRepository;
    private final PGPublicResponseMapper responseMapper;

    public StudentService(
            PGRepository pgRepository,
            MongoTemplate mongoTemplate,
            OwnerRepository ownerRepository,
            PGPublicResponseMapper responseMapper
    ) {
        this.pgRepository = pgRepository;
        this.mongoTemplate = mongoTemplate;
        this.ownerRepository = ownerRepository;
        this.responseMapper = responseMapper;
    }

    /**
     * Fetch only approved PG listings for students.
     */
    @Cacheable(
            value = "approvedPgs",
            key = "#pageable.pageNumber + '-' + "
                    + "#pageable.pageSize + '-' "
                    + "+ #pageable.sort"
    )
    public Page<PG> getApprovedPGs(Pageable pageable) {
        return pgRepository.findByApprovalStatus(
                ApprovalStatus.APPROVED,
                pageable
        );
    }

    public List<com.studentpg.modules.student.dto.response.NearbyPGResponse> searchNearbyPGs(
            Double latitude,
            Double longitude,
            Double radiusKm
    ) {
        if (latitude == null || longitude == null || radiusKm == null) {
            throw new IllegalArgumentException("Latitude, longitude, and radiusKm are required.");
        }

        validateCoordinates(latitude, longitude);
        validateRadius(radiusKm);

        Point point = new Point(longitude, latitude);
        Query baseQuery = new Query();
        baseQuery.addCriteria(Criteria.where("approvalStatus").is(ApprovalStatus.APPROVED));

        NearQuery nearQuery = NearQuery.near(point)
                .spherical(true)
                .inKilometers()
                .maxDistance(radiusKm)
                .query(baseQuery)
                .limit(MAX_NEARBY_RESULTS);

        var geoResults = mongoTemplate.geoNear(nearQuery, PG.class);
        List<com.studentpg.modules.student.dto.response.NearbyPGResponse> results = new ArrayList<>();

        for (var geoResult : geoResults) {
            PG pg = geoResult.getContent();
            if (pg == null) {
                continue;
            }

            com.studentpg.modules.student.dto.response.NearbyPGResponse response =
                    new com.studentpg.modules.student.dto.response.NearbyPGResponse();
            response.setId(pg.getId());
            response.setPgName(pg.getPgName());
            response.setAddress(pg.getAddress());
            response.setCity(pg.getCity());
            response.setState(pg.getState());
            response.setCategory(pg.getCategory());
            response.setRent(pg.getRent());
            response.setGender(pg.getGender());
            response.setRoomType(pg.getRoomType());
            response.setImages(pg.getImages());
            response.setLatitude(pg.getLatitude());
            response.setLongitude(pg.getLongitude());
            response.setDistanceKm(BigDecimal.valueOf(geoResult.getDistance().getValue()));
            results.add(response);
        }

        return results;
    }

    private void validateCoordinates(double latitude, double longitude) {
        if (Double.isNaN(latitude) || Double.isInfinite(latitude)
                || Double.isNaN(longitude) || Double.isInfinite(longitude)) {
            throw new IllegalArgumentException("Latitude and longitude must be valid numbers.");
        }

        if (latitude < -90 || latitude > 90) {
            throw new IllegalArgumentException("Latitude must be between -90 and 90.");
        }

        if (longitude < -180 || longitude > 180) {
            throw new IllegalArgumentException("Longitude must be between -180 and 180.");
        }
    }

    private void validateRadius(double radiusKm) {
        if (Double.isNaN(radiusKm) || Double.isInfinite(radiusKm) || radiusKm <= 0) {
            throw new IllegalArgumentException("Radius must be a positive number.");
        }

        if (radiusKm > MAX_NEARBY_RADIUS_KM) {
            throw new IllegalArgumentException("Radius must be less than or equal to 10 km.");
        }
    }

    /**
     * Fetch one approved PG by ID.
     *
     * Students must never receive PENDING or REJECTED listings.
     */
    public PGDetailsResponse getPGDetails(String id) {

        if (id == null || id.isBlank()) {
            return null;
        }

        PG pg = pgRepository
                .findByIdAndApprovalStatus(
                        id,
                        ApprovalStatus.APPROVED
                )
                .orElse(null);

        if (pg == null) {
            return null;
        }

        Owner owner = null;
        if (pg.getOwnerId() != null && !pg.getOwnerId().isBlank()) {
            owner = ownerRepository.findById(pg.getOwnerId()).orElse(null);
        }

        return responseMapper.toPublicResponse(pg, owner);
    }

    /**
     * Search approved PGs by exact city.
     */
    public Page<PG> searchByCity(
            String city,
            Pageable pageable
    ) {

        if (city == null || city.isBlank()) {
            return Page.empty(pageable);
        }

        return pgRepository.findByApprovalStatusAndCity(
                ApprovalStatus.APPROVED,
                city.trim(),
                pageable
        );
    }

    /**
     * Filter approved PGs by gender/category.
     */
   public Page<PG> filterByGender(
        String gender,
        Pageable pageable
) {

    if (gender == null || gender.isBlank()) {
        return Page.empty(pageable);
    }

    Gender genderEnum = Gender.parse(gender);

    if (genderEnum == null) {
        return Page.empty(pageable);
    }

    return pgRepository.findByApprovalStatusAndGender(
            ApprovalStatus.APPROVED,
            genderEnum,
            pageable
    );
}

    /**
     * Filter approved PGs by maximum rent.
     */
    public Page<PG> filterByRent(
            double rent,
            Pageable pageable
    ) {

        if (rent < 0) {
            return Page.empty(pageable);
        }

        return pgRepository.findByApprovalStatusAndRentLessThanEqual(
        ApprovalStatus.APPROVED,
        BigDecimal.valueOf(rent),
        pageable
);
    }

    /**
     * Search suggestions for PG name and city.
     *
     * Only approved PGs are exposed.
     *
     * Only _id, pgName and city are returned.
     */
    public List<PGSuggestionResponse> getSearchSuggestions(String query) {

    if (query == null || query.trim().length() < 2) {
        return List.of();
    }

    query = query.trim();

    Query mongoQuery = new Query();

    mongoQuery.addCriteria(
            new Criteria().andOperator(

                    Criteria.where("approvalStatus")
                            .is(ApprovalStatus.APPROVED),

                    new Criteria().orOperator(

                            Criteria.where("pgName")
                                    .regex(
                                            "^" + Pattern.quote(query),
                                            "i"
                                    ),

                            Criteria.where("address")
                                    .regex(
                                            "^" + Pattern.quote(query),
                                            "i"
                                    ),

                            Criteria.where("city")
                                    .regex(
                                            "^" + Pattern.quote(query),
                                            "i"
                                    ),

                            Criteria.where("state")
                                    .regex(
                                            "^" + Pattern.quote(query),
                                            "i"
                                    )
                    )
            )
    );

    mongoQuery
            .limit(8)
            .fields()
            .include("_id")
            .include("pgName")
            .include("address")
            .include("city")
            .include("state");

    return mongoTemplate
        .find(mongoQuery, PG.class)
        .stream()
        .map(pg -> new PGSuggestionResponse(
                pg.getId(),
                pg.getPgName(),
                pg.getAddress(),
                pg.getCity(),
                pg.getState()
        ))
        .toList();
}

    /**
     * Dynamic filter for approved PGs.
     */
    public Page<PG> filterPGs(
            String city,
            String category,
            Double maxRent,
            Boolean food,
            Boolean wifi,
            Boolean parking,
            Boolean laundry,
            String roomType,
            Pageable pageable
    ) {

        Query query = new Query();

        /*
         * Always restrict results to approved PGs.
         */
        query.addCriteria(
                Criteria.where("approvalStatus")
                        .is("APPROVED")
        );

        /*
         * Apply optional filters only when supplied.
         */
        if (city != null && !city.isBlank()) {

            query.addCriteria(
                    Criteria.where("city")
                            .is(city.trim())
            );
        }

        if (category != null && !category.isBlank()) {

            query.addCriteria(
                    Criteria.where("category")
                            .is(category.trim())
            );
        }

        if (maxRent != null && maxRent >= 0) {

            query.addCriteria(
                    Criteria.where("rent")
                            .lte(maxRent)
            );
        }

        if (food != null) {

            query.addCriteria(
                    Criteria.where("foodAvailable")
                            .is(food)
            );
        }

        if (wifi != null) {

            query.addCriteria(
                    Criteria.where("wifiAvailable")
                            .is(wifi)
            );
        }

        if (parking != null) {

            query.addCriteria(
                    Criteria.where("parkingAvailable")
                            .is(parking)
            );
        }

        if (laundry != null) {

            query.addCriteria(
                    Criteria.where("laundryAvailable")
                            .is(laundry)
            );
        }

        if (roomType != null && !roomType.isBlank()) {

            query.addCriteria(
                    Criteria.where("roomType")
                            .is(roomType.trim())
            );
        }

        /*
         * Apply pagination and sorting.
         */
        query.with(pageable);

        List<PG> results =
                mongoTemplate.find(query, PG.class);

        /*
         * Create a separate count query without pagination.
         */
        Query countQuery =
                Query.of(query)
                        .limit(-1)
                        .skip(-1);

        long total =
                mongoTemplate.count(
                        countQuery,
                        PG.class
                );

        return PageableExecutionUtils.getPage(
                results,
                pageable,
                () -> total
        );
    }
}