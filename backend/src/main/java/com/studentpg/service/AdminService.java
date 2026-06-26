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
}