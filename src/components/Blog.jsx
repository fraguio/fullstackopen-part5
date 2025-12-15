import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ user, blog, setBlogs }) => {
  const [showDetail, setShowDetail] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleDelete = async (blog) => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (!ok) return

    await blogService.remove(blog.id)
    setBlogs((blogs) => blogs.filter((b) => b.id !== blog.id))
  }

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)

    setBlogs((blogs) =>
      blogs.map((b) => (b.id === blog.id ? returnedBlog : b))
    )
  }

  return (
    <div style={blogStyle} className="blog">
      <div className="blog-summary">
        {blog.title} {blog.author}{' '}
        <button onClick={() => setShowDetail(!showDetail)}>
          {showDetail ? 'hide' : 'view'}
        </button>
      </div>

      {showDetail && (
        <div className="blog-details">
          <div className="blog-url">{blog.url}</div>
          <div className="blog-likes">
            likes {blog.likes} <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.author}</div>

          {blog.user.id === user.id && (
            <button onClick={() => handleDelete(blog)}>Delete</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
