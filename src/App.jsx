import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import LoginForm from "./components/LoginForm";
import loginService from "./services/login";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  const blogFormRef = useRef();

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
        showNotification("error", `failed to fetch blogs ${error}`);
      }
    };

    if (user) {
      fetchBlogs();
    }
  }, [user]);

  const clearLoginForm = () => {
    setUsername("");
    setPassword("");
  };

  const handleBlogFormSubmit = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(createdBlog));

      blogFormRef.current.toggleVisibility();

      showNotification(
        "success",
        `a new blog "${createdBlog.title}" by ${createdBlog.author} added`
      );
    } catch (error) {
      showNotification("error", error.response.data.error);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      clearLoginForm();
    } catch (error) {
      showNotification("error", error.response.data.error);
      clearLoginForm();
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div>
      {!user && (
        <div>
          <h2>log in to application</h2>
          <Notification notification={notification} />
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            password={password}
            handlePasswordChange={({ target }) => setPassword(target.value)}
          />
        </div>
      )}

      {user && (
        <div>
          <h2>blogs</h2>
          <Notification notification={notification} />

          <p>
            {user.username} logged in{" "}
            <button onClick={handleLogout}>logout</button>
          </p>

          <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
            <BlogForm createBlog={handleBlogFormSubmit} />
          </Togglable>

          <div>
            {[...blogs]
              .sort((a, b) => b.likes - a.likes)
              .map((blog) => {
                return (
                  <Blog
                    key={blog.id}
                    user={user}
                    blog={blog}
                    setBlogs={setBlogs}
                  />
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
