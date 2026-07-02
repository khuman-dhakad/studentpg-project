package com.studentpg.service;

import com.studentpg.model.PG;
import com.studentpg.repository.PGRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private PGRepository pgRepository;

    // === Aapka Existing Code ===
    public List<PG> getPendingPGs() {
        return pgRepository.findByApprovalStatus("PENDING");
    }

    public String approvePG(String id) {
        PG pg = pgRepository.findById(id).orElse(null);

        if (pg == null) {
            return "PG not found";
        }

        pg.setApprovalStatus("APPROVED");
        pgRepository.save(pg);

        return "PG approved successfully";
    }

    public String rejectPG(String id) {
        PG pg = pgRepository.findById(id).orElse(null);

        if (pg == null) {
            return "PG not found";
        }

        pgRepository.deleteById(id);
        return "PG rejected successfully";
    }

    // === Naye Methods ===
    
    // 1. Total, Approved, Pending Counters ke liye real data map
    public Map<String, Long> getAdminStats() {
        Map<String, Long> stats = new HashMap<>();
        
        long total = pgRepository.count();
        long approved = pgRepository.countByApprovalStatus("APPROVED");
        long pending = pgRepository.countByApprovalStatus("PENDING");
        
        stats.put("total", total);
        stats.put("approved", approved);
        stats.put("pending", pending);
        
        return stats;
    }

    // 2. Tab filtering ke liye data (ALL, APPROVED, PENDING)
    public List<PG> getAllPGsByStatus(String status) {
        if (status == null || status.equalsIgnoreCase("ALL")) {
            return pgRepository.findAll();
        }
        return pgRepository.findByApprovalStatus(status.toUpperCase());
    }

    // 3. YouTube-like dynamic DB suggestions
    public List<PG> getSearchSuggestions(String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }
        
        List<PG> results = pgRepository.findTop8ByNameContainingIgnoreCase(query.trim());
        
        // Safe check: Agar results 8 se zyada aayein toh top 8 par sublist kar dena
        if (results.size() > 8) {
            return results.subList(0, 8);
        }
        return results;
    }
}