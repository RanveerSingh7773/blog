import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { API_URL } from "./api";

export default function Blogs({ token, currentUser }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMine, setFilterMine] = useState(false);
  const [activeStory, setActiveStory] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch stories. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (blogId, blogTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${blogTitle || "this blog"}"?`)) {
      return;
    }

    try {
      setDeletingId(blogId);
      await api.delete(`/api/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs((prev) => prev.filter((b) => b._id !== blogId));
      if (activeStory?._id === blogId) setActiveStory(null);
      alert("Blog deleted successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete blog.");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter blogs
  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      (b.title && b.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.content && b.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.author && b.author.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterMine && currentUser) {
      const isOwner =
        (b.user && currentUser.userId && (b.user === currentUser.userId || b.user._id === currentUser.userId)) ||
        (b.author && currentUser.username && b.author === currentUser.username);
      return isOwner;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-indigo-400">
            BV
          </div>
        </div>
        <p className="text-slate-400 text-sm font-medium animate-pulse">Curating latest stories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-center backdrop-blur-xl">
        <div className="text-3xl mb-3">⚠️</div>
        <p className="text-rose-400 font-semibold mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-rose-600/30"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-14">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-6">
        {/* Glow pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-cyan-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide shadow-[0_0_20px_rgba(99,102,241,0.2)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Next-Generation Publishing Platform</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">v2.0 Premium</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
          <span className="bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Where great ideas
          </span>{" "}
          <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(99,102,241,0.4)]">
            ignite the world.
          </span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
          Discover hand-crafted stories, tutorials, and perspectives from modern thinkers and builders.
        </p>

        {/* Feature Highlights Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 pt-1 text-xs text-slate-400 font-medium">
          <span className="px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/5 flex items-center gap-1.5">
            <span className="text-cyan-400">⚡</span> Instant Publishing
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/5 flex items-center gap-1.5">
            <span className="text-violet-400">💎</span> Zero Subscription Fees
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/5 flex items-center gap-1.5">
            <span className="text-emerald-400">🔒</span> Author Ownership
          </span>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search by title, author, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition shadow-inner backdrop-blur-md"
            />
            <svg
              className="w-4 h-4 text-indigo-400 absolute left-4 top-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3.5 top-3.5 text-xs text-slate-500 hover:text-slate-300 w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {currentUser && (
            <button
              onClick={() => setFilterMine(!filterMine)}
              className={`px-5 py-3.5 rounded-2xl border text-sm font-semibold transition whitespace-nowrap cursor-pointer flex items-center gap-2 w-full sm:w-auto justify-center active:scale-95 ${
                filterMine
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30"
                  : "bg-slate-900/80 border-white/10 text-slate-300 hover:border-white/20 backdrop-blur-md"
              }`}
            >
              <span>{filterMine ? "✓ My Posts" : "My Posts Only"}</span>
            </button>
          )}
        </div>
      </section>

      {/* Stories Feed */}
      <section>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white tracking-tight">Curated Feed</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-300">
              {filteredBlogs.length} Stories
            </span>
          </div>

          <Link
            to="/create"
            className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 hover:opacity-80 transition flex items-center gap-1.5"
          >
            <span>+ Write New Story</span>
          </Link>
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="glass-panel rounded-3xl p-16 text-center max-w-lg mx-auto space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center mx-auto text-2xl shadow-inner">
              ✍️
            </div>
            <h3 className="text-xl font-bold text-white">No Stories Found</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {searchTerm
                ? `No stories matched your search for "${searchTerm}". Try another keyword.`
                : "No blogs have been published yet. Be the first to share your thoughts!"}
            </p>
            <Link
              to="/create"
              className="inline-block px-6 py-2.5 rounded-xl btn-primary text-white font-semibold text-sm transition shadow-lg shadow-indigo-500/30 active:scale-95"
            >
              Publish a Story Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredBlogs.map((b, i) => {
              const isOwner =
                Boolean(currentUser) &&
                Boolean(token) &&
                ((b.user && currentUser.userId && (b.user === currentUser.userId || b.user._id === currentUser.userId)) ||
                  (b.author && currentUser.username && b.author === currentUser.username));

              const wordsCount = (b.content || "").trim().split(/\s+/).length;
              const readTime = Math.max(1, Math.ceil(wordsCount / 180));

              return (
                <article
                  key={b._id || i}
                  className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 relative group"
                >
                  <div className="cursor-pointer" onClick={() => setActiveStory(b)}>
                    {/* Cover Image */}
                    {b.image ? (
                      <div className="aspect-[16/10] w-full overflow-hidden bg-slate-950 relative">
                        <img
                          src={b.image.startsWith("http") ? b.image : `${API_URL}${b.image}`}
                          alt={b.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60"></div>
                        <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-semibold text-slate-300 border border-white/10 shadow-sm">
                          {readTime} min read
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-[16/10] w-full bg-gradient-to-tr from-slate-950 via-indigo-950/40 to-slate-900 flex items-center justify-center relative p-6 border-b border-white/[0.05]">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xl group-hover:scale-110 transition-transform">
                          📖
                        </div>
                        <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-semibold text-slate-300 border border-white/10">
                          {readTime} min read
                        </div>
                      </div>
                    )}

                    {/* Content Preview */}
                    <div className="p-6 space-y-3">
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                        {b.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 whitespace-pre-line font-normal">
                        {b.content}
                      </p>
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <div className="p-6 pt-0">
                    <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 p-[1px] shadow-sm">
                          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-[11px] font-bold text-white">
                            {(b.author || "A")[0].toUpperCase()}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-200 truncate max-w-[110px]">
                            {b.author || "Anonymous"}
                          </span>
                          {b.createdAt && (
                            <span className="text-[10px] text-slate-500">
                              {new Date(b.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveStory(b)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                        >
                          Read Story →
                        </button>

                        {isOwner && (
                          <button
                            onClick={() => handleDelete(b._id, b.title)}
                            disabled={deletingId === b._id}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                            title="Delete this blog"
                          >
                            {deletingId === b._id ? "..." : "🗑️"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Full Story Modal / Reading View */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                  {(activeStory.author || "A")[0].toUpperCase()}
                </span>
                <div>
                  <h4 className="font-bold text-white text-sm">{activeStory.author || "Anonymous"}</h4>
                  {activeStory.createdAt && (
                    <p className="text-[11px] text-slate-400">
                      {new Date(activeStory.createdAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setActiveStory(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {activeStory.title}
              </h2>

              {activeStory.image && (
                <div className="rounded-2xl overflow-hidden border border-slate-800">
                  <img
                    src={activeStory.image.startsWith("http") ? activeStory.image : `${API_URL}${activeStory.image}`}
                    alt={activeStory.title}
                    className="w-full max-h-96 object-cover"
                  />
                </div>
              )}

              <div className="text-slate-300 text-base leading-relaxed whitespace-pre-line font-normal">
                {activeStory.content}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
              <button
                onClick={() => setActiveStory(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition"
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

