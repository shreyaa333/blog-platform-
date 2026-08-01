import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-5 py-20">
      <h1 className="font-display text-3xl font-semibold mb-2">Join Inkwell</h1>
      <p className="text-stone text-sm mb-8">Create an account to start writing.</p>

      {error && (
        <div className="bg-signal/10 border border-signal/30 text-signal-dark rounded-lg px-4 py-3 text-sm mb-5">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-stone mb-1.5">Full name</label>
          <input required value={form.name} onChange={update("name")}
            className="w-full border border-line rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-signal/30" />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-stone mb-1.5">Username</label>
          <input required value={form.username} onChange={update("username")}
            pattern="[a-z0-9_]+" title="Lowercase letters, numbers and underscores only"
            className="w-full border border-line rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-signal/30" />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-stone mb-1.5">Email</label>
          <input type="email" required value={form.email} onChange={update("email")}
            className="w-full border border-line rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-signal/30" />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-stone mb-1.5">Password</label>
          <input type="password" required minLength={6} value={form.password} onChange={update("password")}
            className="w-full border border-line rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-signal/30" />
        </div>
        <button
          disabled={loading}
          className="w-full bg-ink text-paper py-2.5 rounded-full font-medium hover:bg-signal transition-colors disabled:opacity-40"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-sm text-stone mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-signal underline">Sign in</Link>
      </p>
    </div>
  );
}
