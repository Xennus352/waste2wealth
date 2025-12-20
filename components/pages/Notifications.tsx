"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";
import { Bell } from "lucide-react";

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

interface NotificationsProps {
  userId: string;
}

const Notifications: React.FC<NotificationsProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();

    // 1️⃣ Fetch existing notifications
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (data) setNotifications(data);
    };
    fetchNotifications();

    // 2️⃣ Realtime subscription
    const channel = supabase
      .channel("user-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          toast.success(`${newNotification.title}\n${newNotification.message}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // 3️⃣ Mark notification as read
  const markAsRead = async (id: string) => {
    const supabase = createClient();
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <Bell className="w-6 h-6" />
        {notifications.some(n => !n.read) && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl z-50 max-h-96 overflow-y-auto">
          <h3 className="px-4 py-2 font-semibold border-b">Notifications</h3>
          {notifications.length === 0 && (
            <p className="p-4 text-gray-500 text-sm">No notifications</p>
          )}
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`px-4 py-3 border-b cursor-pointer hover:bg-gray-50 flex justify-between items-start ${
                n.read ? "bg-gray-50" : "bg-white"
              }`}
              onClick={() => markAsRead(n.id)}
            >
              <div>
                <p className="font-semibold">{n.title}</p>
                <p className="text-sm text-gray-600 whitespace-pre-line">{n.message}</p>
              </div>
              {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
