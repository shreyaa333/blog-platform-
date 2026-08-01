import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import NotificationBell from "./NotificationBell.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const submitSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const ThemeToggle = ({ className = "" }) => (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className={`w-9 h-9 flex items-center justify-center rounded-full hover:bg-paper-2 transition-colors text-ink ${className}`}
    >
      {theme === "dark" ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );

  return (
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-5">
        <div className="h-16 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <span className="font-display text-2xl font-semibold tracking-tight text-ink">
              Ink<span className="text-signal">well</span>
            </span>
          </Link>

          <form onSubmit={submitSearch} className="hidden md:flex flex-1 max-w-md">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search stories, tags, authors..."
              className="w-full bg-paper-2 border border-line rounded-full px-4 py-2 text-sm font-body placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-signal/40"
            />
          </form>

          <nav className="hidden md:flex items-center gap-4 font-body text-sm">
            <ThemeToggle />

            {user ? (
              <>
                <Link to="/write" className="text-ink hover:text-signal transition-colors font-medium">
                  Write
                </Link>

                <Link to="/saved" className="text-ink hover:text-signal transition-colors font-medium">
                  Saved
                </Link>

                <NotificationBell />
                
                <Link to={`/@${user.username}`} className="flex items-center gap-2 group">
                  <img
                    src={
                      user.avatar ||
                      `https://ui-avatars.com/api/?name=${user.name}&background=C9628F&color=fff`
                    }
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-line group-hover:border-signal transition-colors"
                  />
                </Link>

                <button
                  onClick={logout}
                  className="text-stone hover:text-signal transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-ink hover:text-signal transition-colors font-medium">
                  Sign in
                </Link>

                <Link
                  to="/register"
                  className="bg-ink text-paper px-4 py-2 rounded-full hover:bg-signal transition-colors font-medium"
                >
                  Get started
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            {user && <NotificationBell />}

            <button
              className="text-ink w-9 h-9 flex items-center justify-center"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-line bg-paper px-5 py-4 space-y-3 animate-fadeIn">
          <form onSubmit={submitSearch}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search..."
              className="w-full bg-paper-2 border border-line rounded-full px-4 py-2 text-sm focus:outline-none"
            />
          </form>

          {user ? (
            <div className="flex flex-col gap-3 text-sm">
              <Link to="/write" onClick={() => setMenuOpen(false)}>
                Write
              </Link>

              <Link to="/saved" onClick={() => setMenuOpen(false)}>
                Saved
              </Link>

              <Link
                to={`/@${user.username}`}
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>

              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="text-left text-stone"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 text-sm">
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Sign in
              </Link>

              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="font-medium text-signal"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}