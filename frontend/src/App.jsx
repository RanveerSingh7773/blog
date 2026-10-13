import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import CreateBlog from "./Createblog";
import Blogs from "./Blogs";
export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Save token & user on login
  const handleLogin = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("token", newToken);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  // Logout
  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
        {/* Top Accent Rainbow Line */}
        <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 z-[60]"></div>

        {/* Dynamic ambient background glow orbs */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent blur-[140px] pointer-events-none -z-10"></div>
        <div className="fixed top-1/3 -left-40 w-[600px] h-[600px] bg-cyan-500/5 blur-[160px] pointer-events-none -z-10"></div>
        <div className="fixed bottom-0 -right-40 w-[600px] h-[600px] bg-violet-500/5 blur-[160px] pointer-events-none -z-10"></div>

        {/* Fixed Navigation Bar */}
        <header className="fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-2xl bg-[#030712]/80 border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 rounded-xl blur-sm opacity-60 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-white/10 shadow-inner">
                  <svg className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Blog<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Verse</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-indigo-400/80 font-bold -mt-1">
                  Community Platform
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="flex items-center gap-2 sm:gap-3 text-sm font-medium">
              <Link
                to="/blogs"
                className="px-3.5 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] transition flex items-center gap-1.5"
              >
                <span>Explore</span>
              </Link>

              {!token ? (
                <>
                  <Link
                    to="/login"
                    className="px-3.5 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-xl btn-primary text-white font-semibold shadow-lg shadow-indigo-500/25 active:scale-95 transition-all text-xs sm:text-sm"
                  >
                    Get Started Free
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/create"
                    className="px-4 py-2 rounded-xl btn-primary text-white font-semibold shadow-lg shadow-indigo-500/25 flex items-center gap-1.5 active:scale-95 text-xs sm:text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Write Story</span>
                  </Link>

                  {user?.username && (
                    <div className="hidden sm:flex items-center gap-2 pl-2 pr-3.5 py-1 rounded-full bg-slate-900/90 border border-white/10 text-xs text-slate-200 shadow-inner">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white font-bold flex items-center justify-center text-[10px]">
                        {user.username[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-100 truncate max-w-[100px]">{user.username}</span>
                    </div>
                  )}

                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition text-xs font-semibold cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <Routes>
            <Route path="/" element={<Blogs token={token} currentUser={user} />} />
            <Route path="/blogs" element={<Blogs token={token} currentUser={user} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setToken={handleLogin} />} />
            <Route
              path="/create"
              element={
                token ? (
                  <CreateBlog token={token} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto">
                    <div className="relative mb-4">
                      <div className="absolute -inset-2 bg-indigo-500/20 rounded-full blur-xl"></div>
                      <div className="relative w-16 h-16 rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center text-indigo-400 text-2xl shadow-xl">
                        🔒
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-white">Sign In to Publish</h2>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                      Join our creator community to write, edit, and publish captivating stories.
                    </p>
                    <Link
                      to="/login"
                      className="px-6 py-2.5 rounded-xl btn-primary text-white font-semibold text-sm shadow-lg shadow-indigo-500/30 active:scale-95"
                    >
                      Log In to Continue
                    </Link>
                  </div>
                )
              }
            />
          </Routes>
        </main>

        {/* Luxury Footer */}
        <footer className="border-t border-white/[0.06] bg-[#030712]/90 backdrop-blur-md py-10 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-white">
                B
              </div>
              <span className="font-bold text-slate-300">BlogVerse</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">Crafted with modern web technologies</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Systems Operational
              </span>
              <span>© {new Date().getFullYear()} BlogVerse Inc.</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}




