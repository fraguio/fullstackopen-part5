import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    // Define y llama a una función asíncrona dentro del callback.
    // useEffect no puede ser async
    const fetchBlogs = async () => {
      try {
        // Uso de await dentro de la función asíncrona
        const blogs = await blogService.getAll();
        setBlogs(blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    if (user) {
      fetchBlogs();
    }
  }, [user]);

  const blogForm = () => (
    <form onSubmit={handleBlogFormSubmit}>
      <h2>create new</h2>
      <div>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Author:
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          url:
          <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </label>
      </div>
      <p>
        <button type="submit">Create</button>
      </p>
    </form>
  );

  const handleBlogFormSubmit = async (event) => {
    event.preventDefault();
    const newBlog = {
      title,
      author,
      url,
    };

    const createdBlog = await blogService.create(newBlog);
    setBlogs(blogs.concat(createdBlog));
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (error) {
      setErrorMessage(error.response.data.error);
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  const handleLogout = async () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">Login</button>
    </form>
  );

  return (
    <div>
      {!user && (
        <div>
          <h2>log in to application</h2>
          <Notification message={errorMessage} />
          {loginForm()}
        </div>
      )}
      {user && (
        <div>
          <h2>blogs</h2>
          <p>
            {`${user.username} logged in `}
            <button onClick={handleLogout}>Logout</button>
          </p>
          <div>{blogForm()}</div>
          <div>
            {blogs.map((blog) => (
              <Blog key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
