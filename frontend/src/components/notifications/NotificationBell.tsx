'use client';

import {
  Bell,
  CheckCircle2,
  XCircle,
  Trash2,
} from 'lucide-react';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
} from '@/features/notification/api/notificationApi';

export default function NotificationBell() {
  const [open, setOpen] =
    useState(false);

  const containerRef =
    useRef<HTMLDivElement>(null);

  const {
    data: notifications = [],
    isLoading,
  } = useGetNotificationsQuery(undefined, {
    pollingInterval: 30000,
  });

  const {
    data: unreadData,
  } =
    useGetUnreadNotificationCountQuery(
      undefined,
      {
        pollingInterval: 30000,
      }
    );

  const [markAsRead] =
    useMarkNotificationAsReadMutation();

  const [deleteNotification] =
    useDeleteNotificationMutation();

  const unreadCount =
    unreadData?.count ?? 0;

  /*
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent
    ) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      );
    };
  }, []);

  /*
   * Delete notification
   */
  const handleDeleteNotification =
    async (
      event: React.MouseEvent<HTMLButtonElement>,
      id: string
    ) => {
      event.stopPropagation();

      try {
        await deleteNotification(
          id
        ).unwrap();
      } catch (error) {
        console.error(
          'Failed to delete notification:',
          error
        );
      }
    };

  /*
   * Mark notification as read
   */
  const handleNotificationClick =
    async (
      id: string,
      read: boolean
    ) => {
      if (read) {
        return;
      }

      try {
        await markAsRead(
          id
        ).unwrap();
      } catch (error) {
        console.error(
          'Failed to mark notification as read:',
          error
        );
      }
    };

  return (
    <div
      ref={containerRef}
      className="relative"
    >

      {/* NOTIFICATION BUTTON */}
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() =>
          setOpen(
            (value) => !value
          )
        }
        className="relative rounded-xl p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
      >
        <Bell className="h-5 w-5" />

        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white">
            {unreadCount > 99
              ? '99+'
              : unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 top-12 z-50 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Notifications
              </h3>

              <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : 'All caught up'}
              </p>
            </div>
          </div>

          {/* NOTIFICATION LIST */}
          <div className="max-h-96 overflow-y-auto">

            {/* LOADING */}
            {isLoading && (
              <div className="p-6 text-center text-xs font-semibold text-slate-400">
                Loading notifications...
              </div>
            )}

            {/* EMPTY */}
            {!isLoading &&
              notifications.length === 0 && (
                <div className="p-8 text-center">
                  <Bell className="mx-auto h-8 w-8 text-slate-300" />

                  <p className="mt-3 text-xs font-bold text-slate-500">
                    No notifications yet
                  </p>
                </div>
              )}

            {/* NOTIFICATIONS */}
            {!isLoading &&
              notifications.length > 0 &&
              notifications.map(
                (notification) => (
                  <div
                    key={notification.id}
                    className={`flex gap-3 border-b border-slate-100 p-4 transition hover:bg-slate-50 ${
                      !notification.read
                        ? 'bg-emerald-50/30'
                        : 'bg-white'
                    }`}
                  >

                    {/* ICON */}
                    <div className="mt-0.5 shrink-0">
                      {notification.type ===
                      'PG_APPROVED' ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : notification.type ===
                                        'OWNER_VERIFICATION_APPROVED' ? (
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                      ) : notification.type === 'PG_REJECTED' || notification.type === 'OWNER_VERIFICATION_REJECTED' ? (
                        <XCircle className="h-5 w-5 text-rose-500" />
                      ) : (
                        <Bell className="h-5 w-5 text-emerald-600" />
                      )}
                    </div>

                    {/* CONTENT */}
                    <button
                      type="button"
                      onClick={() =>
                        handleNotificationClick(
                          notification.id,
                          notification.read
                        )
                      }
                      className="min-w-0 flex-1 text-left cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">

                        <p className="text-xs font-black text-slate-900">
                          {notification.title}
                        </p>

                        {!notification.read && (
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                        )}
                      </div>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {notification.message}
                      </p>

                      <p className="mt-2 text-[10px] font-semibold text-slate-400">
                        {new Date(
                          notification.createdAt
                        ).toLocaleString()}
                      </p>
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                      type="button"
                      onClick={(event) =>
                        handleDeleteNotification(
                          event,
                          notification.id
                        )
                      }
                      className="h-fit shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                      aria-label="Delete notification"
                      title="Delete notification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                  </div>
                )
              )}

          </div>
        </div>
      )}
    </div>
  );
}