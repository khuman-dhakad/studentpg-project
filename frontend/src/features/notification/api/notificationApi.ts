
import { BACKEND_ENDPOINTS } from '@/api/endpoints';
import { CACHE_TAGS } from '@/api/tagTypes';
import { baseApi } from '@/api/baseApi';

export interface Notification {
  id: string;
  pgId: string | null;
  type: 'PG_APPROVED' | 'PG_REJECTED' | 'OWNER_VERIFICATION_APPROVED' | 'OWNER_VERIFICATION_REJECTED' | string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const notificationApi =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({

      // =====================================================
      // GET ALL NOTIFICATIONS
      // =====================================================

      getNotifications: builder.query<
        Notification[],
        void
      >({
        query: () => BACKEND_ENDPOINTS.NOTIFICATIONS.ALL,

        providesTags: [CACHE_TAGS.NOTIFICATIONS],
      }),

      // =====================================================
      // UNREAD COUNT
      // =====================================================

      getUnreadNotificationCount:
        builder.query<
          { count: number },
          void
        >({
         query: () =>
  BACKEND_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT,

          providesTags: ['Notifications'],
        }),

      // =====================================================
      // MARK AS READ
      // =====================================================

      markNotificationAsRead:
        builder.mutation<
          void,
          string
        >({
          query: (id) => ({
            url: BACKEND_ENDPOINTS.NOTIFICATIONS.MARK_READ(id),
            method: 'PATCH',
          }),

          invalidatesTags: [
  CACHE_TAGS.NOTIFICATIONS,
],
        }),

      // =====================================================
      // DELETE NOTIFICATION
      // =====================================================

      deleteNotification:
        builder.mutation<
          void,
          string
        >({
          query: (id) => ({
            url: BACKEND_ENDPOINTS.NOTIFICATIONS.DELETE(id),
            method: 'DELETE',
          }),

          invalidatesTags: [
  CACHE_TAGS.NOTIFICATIONS,
],
        }),
    }),
  });

export const {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;