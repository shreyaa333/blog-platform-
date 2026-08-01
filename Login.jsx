import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-5 py-20">
      <h1 className="font-display text-3xl font-semibold mb-2">Welcome back</h1>
      <p className="text-stone text-sm mb-8">Sign in to keep reading and writing.</p>

      {error && (
        <div className="bg-signal/10 border border-signal/30 text-signal-dark rounded-lg px-4 py-3 text-sm mb-5">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-stone mb-1.5">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-line rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-signal/30"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-stone mb-1.5">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-line rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-signal/30"
          />
        </div>
        <button
          disabled={loading}
          className="w-full bg-ink text-paper py-2.5 rounded-full font-medium hover:bg-signal transition-colors disabled:opacity-40"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-stone mt-6">
        New to Inkwell?{" "}
        <Link to="/register" className="text-signal underline">Create an account</Link>
      </p>
      <p className="text-xs text-stone mt-4 font-mono">
        Demo login (after seeding): ava@example.com / password123
      </p>
    </div>
  );
}
