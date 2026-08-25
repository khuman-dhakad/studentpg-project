package com.studentpg.security.userdetails;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class StudentPgUserDetails implements UserDetails {

    private final String id;
    private final String username;
    private final String password;
    private final String role;
    private final long tokenVersion;
    private final boolean active;
    private final Collection<? extends GrantedAuthority> authorities;

    public StudentPgUserDetails(
            String id,
            String username,
            String password,
            String role,
            long tokenVersion,
            boolean active
    ) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
        this.tokenVersion = tokenVersion;
        this.active = active;

        String formattedRole = role != null && role.toUpperCase().startsWith("ROLE_")
                ? role.toUpperCase()
                : "ROLE_" + (role != null ? role.toUpperCase() : "USER");
        this.authorities = Collections.singletonList(new SimpleGrantedAuthority(formattedRole));
    }

    public String getId() {
        return id;
    }

    public long getTokenVersion() {
        return tokenVersion;
    }

    public String getRole() {
        return role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}
