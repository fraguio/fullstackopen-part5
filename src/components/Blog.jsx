import { useState } from "react";

import blogService from "../services/blogs";

const Blog = ({ blog, setBlogs }) => {
  const [showDetail, setShowDetail] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    };

    const returnedBlog = await blogService.update(blog.id, updatedBlog);

    setBlogs((blogs) =>
      blogs.map((b) => (b.id === blog.id ? returnedBlog : b))
    );
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{" "}
        <button onClick={() => setShowDetail(!showDetail)}>
          {showDetail ? "hide" : "view"}
        </button>
      </div>

      {showDetail && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.author}</div>
        </div>
      )}
    </div>
  );
};

export default Blog;
