package com.studentpg.service;

import com.studentpg.model.PG;
import com.studentpg.repository.PGRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PGService {

    @Autowired
    private PGRepository pgRepository;

    public String addPG(PG pg) {

        pg.setApprovalStatus("PENDING");

        pgRepository.save(pg);

        return "PG added successfully. Waiting for admin approval.";
    }
    public List<PG> getOwnerPGs(String ownerId) {
    return pgRepository.findByOwnerId(ownerId);
 }
}