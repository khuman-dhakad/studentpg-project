package com.studentpg.common.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Set;

public class PageableUtils {

    private static final int MAX_PAGE_SIZE = 50;
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "rent", "submittedAt", "pgName", "city", "createdAt", "updatedAt"
    );

    public static Pageable build(int page, int size, String sortBy, String direction) {

        if (page < 0) page = 0;
        if (size <= 0) size = 10;
        if (size > MAX_PAGE_SIZE) size = MAX_PAGE_SIZE;

        if (sortBy == null || sortBy.trim().isEmpty() || !ALLOWED_SORT_FIELDS.contains(sortBy.trim())) {
            return PageRequest.of(page, size);
        }

        Sort.Direction dir = "desc".equalsIgnoreCase(direction)
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        return PageRequest.of(page, size, Sort.by(dir, sortBy.trim()));
    }
}