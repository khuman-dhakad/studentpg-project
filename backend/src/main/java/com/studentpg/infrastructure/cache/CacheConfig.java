package com.studentpg.infrastructure.cache;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {

    public static final String CACHE_APPROVED_PGS = "approvedPgs";
    public static final String CACHE_PG_DETAILS = "pgDetails";
    public static final String CACHE_SEARCH_SUGGESTIONS = "searchSuggestions";
    public static final String CACHE_PG_SEARCH = "pgSearch";

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager(
                CACHE_APPROVED_PGS,
                CACHE_PG_DETAILS,
                CACHE_SEARCH_SUGGESTIONS,
                CACHE_PG_SEARCH
        );

        cacheManager.setCaffeine(
                Caffeine.newBuilder()
                        .expireAfterWrite(5, TimeUnit.MINUTES) // cache refreshes every 5 minutes
                        .maximumSize(1000)
                        .recordStats()
        );

        cacheManager.setAllowNullValues(true);
        return cacheManager;
    }
}