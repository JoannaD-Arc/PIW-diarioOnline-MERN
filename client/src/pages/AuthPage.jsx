import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "../styles/auth.css";

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(true);

  return (
    <div className="auth-wrapper">
      <div
        className={`auth-container ${
          isRegister ? "register-mode" : "login-mode"
        }`}
      >
        <Register />
        <Login />

        <div className="overlay-panel">
          <div className="toggle-buttons">
            <button
              type="button"
              className={`toggle-btn ${!isRegister ? "active" : ""}`}
              onClick={() => setIsRegister(false)}
            >
              Login
            </button>

            <button
              type="button"
              className={`toggle-btn ${isRegister ? "active" : ""}`}
              onClick={() => setIsRegister(true)}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
