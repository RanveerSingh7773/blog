import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

export default function CreateBlog({ token }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await api.post("/api/blogs", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Blog Published Successfully!");
      setTitle("");
      setContent("");
      setImageFile(null);
      setPreview("");
      navigate("/blogs");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to post blog. Please try again.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Outer gradient rim */}
      <div className="p-[1px] rounded-3xl bg-gradient-to-b from-indigo-500/30 via-white/[0.06] to-transparent shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]">
        <div className="bg-[#0b0f22]/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
              <span>✍️ Story Studio</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Publish a New Story
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Craft compelling articles and share your unique perspectives with the community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Story Title
              </label>
              <input
                type="text"
                placeholder="Give your story an intriguing, descriptive title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition text-sm shadow-inner font-medium"
                required
              />
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Featured Cover Image <span className="text-slate-500 font-normal lowercase">(optional)</span>
              </label>

              {preview ? (
                <div className="relative rounded-2xl overflow-hidden border border-white/15 max-h-72 group shadow-lg">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition shadow-xl cursor-pointer"
                    >
                      Remove Cover Image
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 hover:border-indigo-500/50 rounded-2xl cursor-pointer bg-slate-950/40 hover:bg-indigo-950/10 transition duration-300 group">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                    🖼️
                  </div>
                  <span className="text-sm font-semibold text-slate-200">
                    Click to select cover image from computer
                  </span>
                  <span className="text-xs text-slate-500 mt-1">Supports PNG, JPG, WEBP up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Story Content
                </label>
                <span className="text-xs text-slate-500 font-medium">
                  {content.trim() ? content.trim().split(/\s+/).length : 0} words • {content.length} characters
                </span>
              </div>
              <textarea
                placeholder="Share your thoughts, experiences, tutorials, or analysis here..."
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition text-sm leading-relaxed shadow-inner"
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl btn-primary text-white font-bold text-base transition shadow-xl shadow-indigo-600/30 disabled:opacity-50 cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  <span>Publishing Story to BlogVerse...</span>
                </>
              ) : (
                <>
                  <span>Publish Story to BlogVerse</span>
                  <span className="text-indigo-200">→</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
