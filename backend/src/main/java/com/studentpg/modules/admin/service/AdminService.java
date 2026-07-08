package com.studentpg.modules.admin.service;

import com.studentpg.modules.pg.entity.PG;
import com.studentpg.modules.pg.repository.PGRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private PGRepository pgRepository;

    public org.springframework.data.domain.Page<PG> getPendingPGs(org.springframework.data.domain.Pageable pageable) {
    return pgRepository.findByApprovalStatus("PENDING", pageable);
    }

    @CacheEvict(value = "approvedPgs", allEntries = true)
    public String approvePG(String id) {
        PG pg = pgRepository.findById(id).orElse(null);
        if (pg == null) {
            return "PG not found";
        }
        pg.setApprovalStatus("APPROVED");
        pgRepository.save(pg);
        return "PG approved successfully";
    }

    @CacheEvict(value = "approvedPgs", allEntries = true)
    public String rejectPG(String id) {
        PG pg = pgRepository.findById(id).orElse(null);
        if (pg == null) {
            return "PG not found";
        }
        pgRepository.deleteById(id);
        return "PG rejected successfully";
    }

    public Map<String, Long> getAdminStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", pgRepository.count());
        stats.put("approved", pgRepository.countByApprovalStatus("APPROVED"));
        stats.put("pending", pgRepository.countByApprovalStatus("PENDING"));
        return stats;
    }

    public Page<PG> getAllPGsByStatus(String status, Pageable pageable) {
        if (status == null || status.equalsIgnoreCase("ALL")) {
            return pgRepository.findAll(pageable);
        }
        return pgRepository.findByApprovalStatus(status.toUpperCase(), pageable);
    }

    public List<PG> getSearchSuggestions(String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }
        List<PG> results = pgRepository.findTop8ByNameContainingIgnoreCase(query.trim());
        if (results.size() > 8) {
            return results.subList(0, 8);
        }
        return results;
    }
}