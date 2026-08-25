package com.studentpg.modules.admin.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "admins")
public class Admin {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String role;

    private boolean active = true;


    public Admin() {
    }


    public Admin(
            String name,
            String email,
            String password,
            String role
    ) {

        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.active = true;
    }


    public String getId() {
        return id;
    }


    public String getName() {
        return name;
    }


    public String getEmail() {
        return email;
    }


    public String getPassword() {
        return password;
    }


    public String getRole() {
        return role;
    }


    public boolean isActive() {
        return active;
    }


    public void setId(
            String id
    ) {

        this.id = id;
    }


    public void setName(
            String name
    ) {

        this.name = name;
    }


    public void setEmail(
            String email
    ) {

        this.email = email;
    }


    public void setPassword(
            String password
    ) {

        this.password = password;
    }


    public void setRole(
            String role
    ) {

        this.role = role;
    }


    public void setActive(
            boolean active
    ) {

        this.active = active;
    }
}