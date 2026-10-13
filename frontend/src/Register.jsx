import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "./api";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/api/auth/register", form);
      alert("Account Created Successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Registration failed. Please try again.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[78vh] flex items-center justify-center py-10 px-4 relative">
      {/* Background radial glow */}
      <div className="absolute w-96 h-96 bg-gradient-to-tr from-cyan-500/15 via-indigo-500/10 to-violet-500/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Luxury Border Wrapper */}
      <div className="w-full max-w-md p-[1px] rounded-3xl bg-gradient-to-b from-cyan-500/30 via-white/[0.08] to-transparent shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] animate-fadeIn">
        <div className="w-full bg-[#0b0f22]/90 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-300 flex items-center justify-center mx-auto text-xl shadow-inner">
              🚀
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Create an Account
            </h2>
            <p className="text-slate-400 text-sm">
              Join thousands of creators sharing ideas on BlogVerse.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Username
              </label>
              <input
                type="text"
                placeholder="e.g. alex_coder"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition text-sm shadow-inner"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition text-sm shadow-inner"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition text-sm shadow-inner"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl btn-primary text-white font-bold text-sm tracking-wide transition shadow-lg shadow-indigo-600/30 disabled:opacity-50 cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Get Started Now →</span>
              )}
            </button>
          </form>

          <div className="text-center pt-3 border-t border-white/[0.08]">
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
