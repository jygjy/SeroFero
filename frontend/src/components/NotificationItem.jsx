import { format, isToday, isYesterday } from "date-fns";
import { cn } from "@/lib/utils";

// Assuming Button is imported or available globally, if not, add import
// import { Button } from "@/components/ui/button"; 

export default function NotificationItem({ notification, onMarkAsRead }) {
  const getTypeStyles = (type) => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      case "info":
      default:
        return "bg-blue-500";
    }
  };

  const formatNotificationDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return `Today at ${format(date, 'p')}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'p')}`;
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  return (
    <div
      className={`flex items-start p-4 hover:bg-accent/50 cursor-pointer transition-colors ${!notification.read ? 'bg-accent' : ''}`}
      onClick={() => !notification.read && onMarkAsRead(notification._id)}
    >
      <div className={cn("w-2 h-10 rounded-full mr-3 flex-shrink-0", getTypeStyles(notification.type))}></div>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-sm font-medium text-foreground">{notification.title}</h4>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {formatNotificationDate(notification.createdAt)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {notification.message}
        </p>
      </div>

      {!notification.read && (
        <div className="ml-3 flex-shrink-0">
        </div>
      )}
    </div>
  );
} 