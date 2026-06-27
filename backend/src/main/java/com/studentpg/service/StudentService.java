package com.studentpg.service;

import com.studentpg.model.PG;
import com.studentpg.repository.PGRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private PGRepository pgRepository;

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
}