package com.studentpg.security.filter;

import com.studentpg.security.jwt.JwtService;
import com.studentpg.security.userdetails.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class JwtAuthenticationFilterTest {

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldReplaceAnonymousAuthenticationWithValidatedJwtAuthentication() throws Exception {
        JwtService jwtService = mock(JwtService.class);
        CustomUserDetailsService userDetailsService = mock(CustomUserDetailsService.class);
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtService, userDetailsService);

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(new Cookie("access_token", "valid-token"));

        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain filterChain = mock(FilterChain.class);

        when(jwtService.extractEmail("valid-token")).thenReturn("owner@example.com");
        when(userDetailsService.loadUserByUsername("owner@example.com")).thenReturn(
                User.withUsername("owner@example.com")
                        .password("encoded-password")
                        .authorities("ROLE_OWNER")
                        .build()
        );
        when(jwtService.isTokenValid("valid-token", "owner@example.com")).thenReturn(true);

        SecurityContextHolder.getContext().setAuthentication(
                new AnonymousAuthenticationToken(
                        "key",
                        "anonymous",
                        List.of(new SimpleGrantedAuthority("ROLE_ANONYMOUS"))
                )
        );

        filter.doFilter(request, response, filterChain);

        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertNotEquals(
                "anonymous",
                SecurityContextHolder.getContext().getAuthentication().getName()
        );
        verify(filterChain).doFilter(request, response);
    }
}
