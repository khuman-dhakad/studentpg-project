package com.studentpg.modules.notification.controller;

import com.studentpg.modules.notification.dto.response.NotificationResponse;
import com.studentpg.modules.notification.service.NotificationService;
import com.studentpg.modules.owner.entity.Owner;
import com.studentpg.modules.owner.repository.OwnerRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final OwnerRepository ownerRepository;

    public NotificationController(
            NotificationService notificationService,
            OwnerRepository ownerRepository
    ) {
        this.notificationService = notificationService;
        this.ownerRepository = ownerRepository;
    }

    /*
     * =====================================================
     * RESOLVE AUTHENTICATED OWNER
     * =====================================================
     */

    private String getAuthenticatedOwnerId(
            Authentication authentication
    ) {

        if (
                authentication == null
                        || authentication.getName() == null
                        || authentication.getName().isBlank()
        ) {
            throw new UsernameNotFoundException(
                    "Authenticated owner not found"
            );
        }

        String email =
                authentication
                        .getName()
                        .trim();

        Owner owner =
                ownerRepository
                        .findByEmailIgnoreCase(email)
                        .orElseThrow(() ->
                                new UsernameNotFoundException(
                                        "Owner not found"
                                )
                        );

        return owner.getId();
    }


    /*
     * =====================================================
     * GET NOTIFICATIONS
     * =====================================================
     */

    @GetMapping
    public ResponseEntity<List<NotificationResponse>>
    getNotifications(
            Authentication authentication
    ) {

        String ownerId =
                getAuthenticatedOwnerId(
                        authentication
                );

        return ResponseEntity.ok(
                notificationService
                        .getOwnerNotifications(
                                ownerId
                        )
        );
    }


    /*
     * =====================================================
     * GET UNREAD COUNT
     * =====================================================
     */

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>>
    getUnreadCount(
            Authentication authentication
    ) {

        String ownerId =
                getAuthenticatedOwnerId(
                        authentication
                );

        long count =
                notificationService
                        .getUnreadCount(
                                ownerId
                        );

        return ResponseEntity.ok(
                Map.of(
                        "count",
                        count
                )
        );
    }


    /*
     * =====================================================
     * MARK AS READ
     * =====================================================
     */

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<Void>
    markAsRead(
            @PathVariable String notificationId,
            Authentication authentication
    ) {

        String ownerId =
                getAuthenticatedOwnerId(
                        authentication
                );

        notificationService.markAsRead(
                notificationId,
                ownerId
        );

        return ResponseEntity.noContent()
                .build();
    }


    /*
     * =====================================================
     * DELETE NOTIFICATION
     * =====================================================
     */

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void>
    deleteNotification(
            @PathVariable String notificationId,
            Authentication authentication
    ) {

        String ownerId =
                getAuthenticatedOwnerId(
                        authentication
                );

        notificationService.deleteNotification(
                notificationId,
                ownerId
        );

        return ResponseEntity.noContent()
                .build();
    }
}