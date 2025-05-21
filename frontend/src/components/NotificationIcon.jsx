"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { format, isToday, isYesterday } from "date-fns"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function NotificationIcon() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const handleAuthError = () => {
    console.log("Authentication error, clearing data and redirecting to login");
    localStorage.clear();
    router.push('/login');
  };

  const validateToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found");
      handleAuthError();
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (showDropdown) {
      fetchNotifications()
    }
  }, [showDropdown])

  useEffect(() => {
    if (!validateToken()) return;

    fetchUnreadCount();
    // Set up polling for unread count
    const interval = setInterval(fetchUnreadCount, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const fetchUnreadCount = async () => {
    try {
      if (!validateToken()) return;

      console.log("Fetching unread count...");
      const response = await axios.get("http://localhost:5001/api/notifications/unread-count", {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        },
      });
      console.log("Unread count response:", response.data);
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
      if (error.response?.status === 401) {
        handleAuthError();
      }
      setUnreadCount(0);
    }
  }

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.log("No token found, skipping notifications fetch");
        setNotifications([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      console.log("Fetching notifications...");
      const response = await axios.get("http://localhost:5001/api/notifications", {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      console.log("Notifications response:", response.data);
      const notificationsWithTypes = response.data.map((notification) => ({
        ...notification,
        type: notification.type || "info",
      }));

      setNotifications(notificationsWithTypes);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      if (error.response?.status === 401) {
        handleAuthError();
      }
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }

  const markAsRead = async (notificationId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.log("No token found, skipping mark as read");
        return;
      }

      console.log("Marking notification as read:", notificationId);
      await axios.put(
        `http://localhost:5001/api/notifications/${notificationId}/read`,
        {},
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        },
      );

      // Update locally first for better UX
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId ? { ...notification, read: true } : notification,
        ),
      );

      // Update unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      if (error.response?.status === 401) {
        handleAuthError();
      }
    }
  }

  const markAllAsRead = async (e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.log("No token found, skipping mark all as read");
        return;
      }

      console.log("Marking all notifications as read");
      await axios.put(
        "http://localhost:5001/api/notifications/mark-all-read",
        {},
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        },
      );

      // Update locally first for better UX
      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));

      // Reset unread count
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      if (error.response?.status === 401) {
        handleAuthError();
      }
    }
  }

  // Group notifications by date
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = new Date(notification.createdAt)
    let groupKey = "Older"

    if (isToday(date)) {
      groupKey = "Today"
    } else if (isYesterday(date)) {
      groupKey = "Yesterday"
    }

    if (!groups[groupKey]) {
      groups[groupKey] = []
    }

    groups[groupKey].push(notification)
    return groups
  }, {})

  // Order of groups
  const groupOrder = ["Today", "Yesterday", "Older"]

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative h-10 w-10 rounded-full"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 md:w-96 bg-card rounded-lg shadow-lg z-50 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Notifications</h3>
                {notifications.some((n) => !n.read) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
            </div>

            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              {loading ? (
                <div className="p-4 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="mx-auto mb-4 bg-muted rounded-full h-12 w-12 flex items-center justify-center">
                    <Bell className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">All caught up!</h3>
                  <p className="text-sm text-muted-foreground mt-1">You don't have any notifications right now.</p>
                </div>
              ) : (
                <div>
                  {groupOrder.map(
                    (group) =>
                      groupedNotifications[group] && (
                        <div key={group}>
                          <div className="px-4 py-2 bg-muted/50">
                            <h4 className="text-xs font-medium text-muted-foreground">{group}</h4>
                          </div>
                          <div className="divide-y divide-border">
                            {groupedNotifications[group].map((notification) => (
                              <NotificationItem
                                key={notification._id}
                                notification={notification}
                                onMarkAsRead={markAsRead}
                              />
                            ))}
                          </div>
                        </div>
                      ),
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function NotificationItem({ notification, onMarkAsRead }) {
  const getTypeStyles = (type) => {
    switch (type) {
      case "success":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <div className={cn("p-4 hover:bg-muted/50 transition-colors", !notification.read && "bg-primary/5")}>
      <div className="flex gap-3">
        <div className={`h-2 w-2 mt-2 rounded-full ${getTypeStyles(notification.type || "info")}`} />
        <div className="flex-1">
          <p className="text-sm">{notification.message}</p>
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-muted-foreground">{format(new Date(notification.createdAt), "h:mm a")}</p>
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-primary hover:text-primary/80"
                onClick={(e) => onMarkAsRead(notification._id, e)}
              >
                Mark as read
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

