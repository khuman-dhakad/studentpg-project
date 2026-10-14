package com.studentpg.modules.search.controller;

import com.studentpg.common.response.PagedResponse;
import com.studentpg.common.util.PageableUtils;
import com.studentpg.modules.pg.entity.PG;
import com.studentpg.modules.search.service.SearchService;

import com.studentpg.modules.student.service.PGPublicResponseMapper;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;


    @GetMapping
    public PagedResponse<PG> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageableUtils.build(page, size, null, null);
        Page<PG> result = searchService.search(q, pageable);

        List<PG> sanitizedContent = result.getContent().stream()
                .map(PGPublicResponseMapper::sanitizePGForPublic)
                .toList();

        return new PagedResponse<>(
                sanitizedContent, result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages());
    }
}
