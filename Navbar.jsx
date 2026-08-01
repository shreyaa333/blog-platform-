import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import NotificationBell from "./NotificationBell.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b border-line bg-paper sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">

        <Link
          to="/"
          className="font-display text-2xl font-semibold"
        >
          Inkwell
        </Link>

        <div className="flex items-center gap-5">

          <Link
            to="/search"
            className="text-sm text-stone hover:text-ink"
          >
            Search
          </Link>

          {user ? (
            <>
              <Link
                to="/write"
                className="text-sm font-medium"
              >
                Write
              </Link>

              <NotificationBell />

              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2"
                >
                  <img
                    src={
                      user.avatar ||
                      `https://ui-avatars.com/api/?name=${user.name}&background=C9628F&color=fff`
                    }
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-line"
                  />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-40 bg-paper border border-line rounded-lg shadow-lg p-2">

                    <Link
                      to={`/profile/${user.username}`}
                      onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2 text-sm hover:bg-paper-2 rounded"
                    >
                      Profile
                    </Link>

                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-paper-2 rounded"
                    >
                      Logout
                    </button>

                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm">
                Login
              </Link>

              <Link
                to="/register"
                className="bg-ink text-paper px-4 py-2 rounded-full text-sm"
              >
                Sign up
              </Link>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}