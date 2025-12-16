const LoginForm = (props) => {
  const {
    handleLogin,
    username,
    handleUsernameChange,
    password,
    handlePasswordChange,
  } = props

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            data-testid='username'
            type="text"
            value={username}
            onChange={handleUsernameChange}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            data-testid='password'
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </label>
      </div>
      <button type="submit">Login</button>
    </form>
  )
}

export default LoginForm
