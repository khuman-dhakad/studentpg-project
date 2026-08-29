package com.studentpg.modules.notification.service;

import com.studentpg.modules.notification.dto.response.NotificationResponse;
import com.studentpg.modules.notification.entity.Notification;
import com.studentpg.modules.notification.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(
            NotificationRepository notificationRepository
    ) {
        this.notificationRepository =
                notificationRepository;
    }

    /*
     * =====================================================
     * CREATE PG APPROVED NOTIFICATION
     * =====================================================
     */

    public void createPGApprovedNotification(
            PGNotificationData data
    ) {

        validateNotificationData(data);

        Notification notification =
                new Notification(
                        data.ownerId(),
                        data.pgId(),
                        "PG_APPROVED",
                        "PG approved",
                        "Your PG listing \""
                                + data.pgName()
                                + "\" has been approved and is now visible to students."
                );

        notificationRepository.save(notification);
    }


    /*
     * =====================================================
     * CREATE PG REJECTED NOTIFICATION
     * =====================================================
     */

    public void createPGRejectedNotification(
            PGNotificationData data
    ) {

        validateNotificationData(data);

        Notification notification =
                new Notification(
                        data.ownerId(),
                        data.pgId(),
                        "PG_REJECTED",
                        "PG rejected",
                        "Your PG listing \""
                        + data.pgName()
                        + "\" was rejected by the administrator. Reason: "
                        + data.rejectionReason()
                );

        notificationRepository.save(notification);
    }

        public void createOwnerVerificationApprovedNotification(String ownerId) {
                validateOwnerId(ownerId);
                notificationRepository.save(new Notification(
                                ownerId,
                                null,
                                "OWNER_VERIFICATION_APPROVED",
                                "Owner verification approved",
                                "Your owner verification has been approved. Your verified owner badge is now active."
                ));
        }

        public void createOwnerVerificationRejectedNotification(String ownerId, String reason) {
                validateOwnerId(ownerId);
                if (reason == null || reason.isBlank()) {
                        throw new IllegalArgumentException("Verification rejection reason is required.");
                }
                notificationRepository.save(new Notification(
                                ownerId,
                                null,
                                "OWNER_VERIFICATION_REJECTED",
                                "Owner verification rejected",
                                "Your owner verification was rejected. Reason: " + reason.trim()
                ));
        }


    /*
     * =====================================================
     * GET OWNER NOTIFICATIONS
     * =====================================================
     */

    @Transactional(readOnly = true)
    public List<NotificationResponse> getOwnerNotifications(
            String ownerId
    ) {

        validateOwnerId(ownerId);

        return notificationRepository
                .findTop20ByOwnerIdOrderByCreatedAtDesc(
                        ownerId
                )
                .stream()
                .map(NotificationResponse::from)
                .toList();
    }


    /*
     * =====================================================
     * GET UNREAD COUNT
     * =====================================================
     */

    @Transactional(readOnly = true)
    public long getUnreadCount(
            String ownerId
    ) {

        validateOwnerId(ownerId);

        return notificationRepository
                .countByOwnerIdAndReadFalse(
                        ownerId
                );
    }


    /*
     * =====================================================
     * MARK AS READ
     * =====================================================
     */

    public void markAsRead(
            String notificationId,
            String ownerId
    ) {

        validateNotificationId(notificationId);
        validateOwnerId(ownerId);

        Notification notification =
                notificationRepository
                        .findByIdAndOwnerId(
                                notificationId.trim(),
                                ownerId
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Notification not found"
                                )
                        );

        notification.markAsRead();

        notificationRepository.save(notification);
    }


    /*
     * =====================================================
     * DELETE NOTIFICATION
     * =====================================================
     *
     * SECURITY:
     *
     * Notification is searched using BOTH:
     *
     * notificationId
     * ownerId
     *
     * Therefore one owner cannot delete
     * another owner's notification.
     *
     */

    public void deleteNotification(
            String notificationId,
            String ownerId
    ) {

        validateNotificationId(notificationId);
        validateOwnerId(ownerId);

        Notification notification =
                notificationRepository
                        .findByIdAndOwnerId(
                                notificationId.trim(),
                                ownerId
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Notification not found"
                                )
                        );

        notificationRepository.delete(notification);
    }


    /*
     * =====================================================
     * VALIDATION
     * =====================================================
     */

    private void validateNotificationId(
            String notificationId
    ) {

        if (
                notificationId == null
                        || notificationId.trim().isEmpty()
        ) {
            throw new IllegalArgumentException(
                    "Notification ID is required"
            );
        }
    }


    private void validateOwnerId(
            String ownerId
    ) {

        if (
                ownerId == null
                        || ownerId.trim().isEmpty()
        ) {
            throw new IllegalArgumentException(
                    "Owner ID is required"
            );
        }
    }


    private void validateNotificationData(
            PGNotificationData data
    ) {

        if (data == null) {
            throw new IllegalArgumentException(
                    "Notification data is required"
            );
        }

        validateOwnerId(data.ownerId());

        if (
                data.pgId() == null
                        || data.pgId().isBlank()
        ) {
            throw new IllegalArgumentException(
                    "PG ID is required"
            );
        }

        if (
                data.pgName() == null
                        || data.pgName().isBlank()
        ) {
            throw new IllegalArgumentException(
                    "PG name is required"
            );
        }
    }


    /*
     * =====================================================
     * NOTIFICATION DATA
     * =====================================================
     */

    public record PGNotificationData(
            String ownerId,
            String pgId,
            String pgName,
            String rejectionReason
    ) {
    }
}