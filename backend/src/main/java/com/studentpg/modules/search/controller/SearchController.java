package com.studentpg.modules.search.controller;

import com.studentpg.common.response.PagedResponse;
import com.studentpg.modules.pg.entity.PG;
import com.studentpg.modules.search.service.SearchService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins="*")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;


    @GetMapping
    public PagedResponse<PG> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<PG> result = searchService.search(q, pageable);

        return new PagedResponse<>(
                result.getContent(), result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages());
    }
} 