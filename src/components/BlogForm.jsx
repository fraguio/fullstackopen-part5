const BlogForm = (props) => {
  const {
    handleBlogFormSubmit,
    title,
    handleTitleChange,
    author,
    handleAuthorChange,
    url,
    handleUrlChange,
  } = props;
  return (
    <form onSubmit={handleBlogFormSubmit}>
      <h2>create new</h2>
      <div>
        <label>
          Title:
          <input type="text" value={title} onChange={handleTitleChange} />
        </label>
      </div>
      <div>
        <label>
          Author:
          <input type="text" value={author} onChange={handleAuthorChange} />
        </label>
      </div>
      <div>
        <label>
          url:
          <input type="text" value={url} onChange={handleUrlChange} />
        </label>
      </div>
      <p>
        <button type="submit">Create</button>
      </p>
    </form>
  );
};

export default BlogForm;
