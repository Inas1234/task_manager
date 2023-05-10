import { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost/api/login", {
        username: username,
        password: password,
      })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("userId", res.data.userId);
          setUsername("");
          setPassword("");
          navigate("/board");
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          alert("Invalid username or password");
        }
      });
  };
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          value={username}
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          value={password}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <div className="signup-link-container">
          <p>Don't have an account?</p>
          <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
