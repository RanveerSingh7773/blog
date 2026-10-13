import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "./api";

export default function Login({ setToken }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/api/auth/login", form);
      setToken(res.data.token, {
        username: res.data.username,
        userId: res.data.userId,
      });
      navigate("/blogs");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Login failed. Please check your credentials.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[78vh] flex items-center justify-center py-10 px-4 relative">
      {/* Background radial glow */}
      <div className="absolute w-96 h-96 bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Luxury Border Wrapper */}
      <div className="w-full max-w-md p-[1px] rounded-3xl bg-gradient-to-b from-indigo-500/30 via-white/[0.08] to-transparent shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] animate-fadeIn">
        <div className="w-full bg-[#0b0f22]/90 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center mx-auto text-xl shadow-inner">
              ✨
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-400 text-sm">
              Enter your credentials to access your BlogVerse account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition text-sm shadow-inner"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition text-sm shadow-inner"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl btn-primary text-white font-bold text-sm tracking-wide transition shadow-lg shadow-indigo-600/30 disabled:opacity-50 cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In to BlogVerse →</span>
              )}
            </button>
          </form>

          <div className="text-center pt-3 border-t border-white/[0.08]">
            <p className="text-sm text-slate-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
