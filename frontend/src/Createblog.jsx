import { useState } from "react";
import axios from "axios";
import "./allCss/CreateBlog.css";

export default function CreateBlog({ token }) {
  const [form, setForm] = useState({ title: "", content: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/blogs/blog", form, {
      headers: { Authorization: token },
    });
    alert("Blog Posted!");
  };

  return (
    <div className="blog-container">
      <form onSubmit={handleSubmit} className="blog-form">
        <h2>Create Blog</h2>

        <input
          type="text"
          placeholder="Blog Title"
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          required
        />

        <textarea
          placeholder="Write your blog content..."
          rows="6"
          onChange={(e) =>
            setForm({ ...form, content: e.target.value })
          }
          required
        ></textarea>

        <button type="submit">Post Blog</button>
      </form>
    </div>
  );
}
