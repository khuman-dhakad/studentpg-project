package com.studentpg.infrastructure.email;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class BrevoConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
