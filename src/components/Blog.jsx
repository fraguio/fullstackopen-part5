import { useState } from 'react'

const Blog = ({ user, blog, handleDelete, handleLike }) => {
  const [showDetail, setShowDetail] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
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
            likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button>
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
