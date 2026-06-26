package com.studentpg.service;

import com.studentpg.model.PG;
import com.studentpg.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    public List<PG> getPendingPGs() {
        return adminRepository.findByApprovalStatus("PENDING");
    }
    public String approvePG(String id) {

    PG pg = adminRepository.findById(id).orElse(null);

    if (pg == null) {
        return "PG not found";
    }

    pg.setApprovalStatus("APPROVED");

    adminRepository.save(pg);

    return "PG approved successfully";
    }
    public String rejectPG(String id) {

    PG pg = adminRepository.findById(id).orElse(null);

    if (pg == null) {
        return "PG not found";
    }

    adminRepository.deleteById(id);

    return "PG rejected successfully";
    }
}