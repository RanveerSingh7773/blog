import { useEffect, useState } from "react";
import axios from "axios";
import './allCss/Blog.css';



export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch blogs. Try again!");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <p className="status">Loading blogs...</p>;
  if (error) return <p className="status error">{error}</p>;

  return (
    <div className="blogs-container">
      <h2 className="blogs-title">All Blogs</h2>

      {blogs.length === 0 && <p>No blogs available.</p>}

      {blogs.map((b, i) => (
        <div className="blog-card" key={i}>
          <h3>{b.title}</h3>

          {b.image && (
            <img src={b.image} alt={b.title} />
          )}

          <p className="content">{b.content}</p>

          <small className="meta">
             By <b>{b.author}</b> • {new Date(b.createdAt).toLocaleString()}     {/*check there what wrong in a dot */}
          </small>
        </div>
      ))}
    </div>
  );
}
