import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import api from "../api/axios.js";

const MESSAGES = {
  like: (n) => `${n.sender?.name} liked your story`,
  comment: (n) => `${n.sender?.name} commented on your story`,
  follow: (n) => `${n.sender?.name} started following you`,
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef(null);

  const refreshCount = () => {
    api.get("/notifications/unread-count").then((res) => setUnread(res.data.count)).catch(() => {});
  };

  useEffect(() => {
    refreshCount();
    const interval = setInterval(refreshCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const toggleOpen = async () => {
    const next = !open;
    setOpen(next);
    if (next && !loaded) {
      const res = await api.get("/notifications");
      setNotifications(res.data);
      setLoaded(true);
    }
    if (next && unread > 0) {
      await api.put("/notifications/read-all");
      setUnread(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggleOpen}
        aria-label="Notifications"
        className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-paper-2 transition-colors"
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-signal rounded-full border-2 border-paper" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-paper border border-line rounded-xl shadow-lg z-50 animate-fadeIn">
          <div className="px-4 py-3 border-b border-line font-display font-semibold text-sm">
            Notifications
          </div>
          {notifications.length === 0 ? (
            <p className="text-stone text-sm px-4 py-8 text-center">No notifications yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {notifications.map((n) => (
                <li key={n._id} className={`px-4 py-3 text-sm ${!n.read ? "bg-paper-2/60" : ""}`}>
                  <Link
                    to={n.post ? `/post/${n.post.slug}` : `/@${n.sender?.username}`}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-2.5"
                  >
                    <img
                      src={n.sender?.avatar || `https://ui-avatars.com/api/?name=${n.sender?.name}&background=C9628F&color=fff`}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <div>
                      <p className="text-ink leading-snug">{MESSAGES[n.type]?.(n) || "New notification"}</p>
                      {n.post && <p className="text-stone text-xs mt-0.5 truncate">{n.post.title}</p>}
                      <p className="text-stone text-xs font-mono mt-0.5">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
