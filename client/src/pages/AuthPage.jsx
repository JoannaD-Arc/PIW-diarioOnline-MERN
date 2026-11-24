import { useState } from "react";
import { FaFeatherAlt } from "react-icons/fa";
import Login from "./Login";
import Register from "./Register";
import "../styles/auth.css";
import { useTituloPagina } from "../hooks/useTituloPagina";

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(true);

  useTituloPagina(isRegister ? "Registrarse" : "Iniciar sesión");

  return (
    <div className="auth-wrapper auth-koi-theme">
      <div className="auth-header">
        <h1>
          {isRegister ? "Empieza tu primer diario" : "Qué bueno verte de vuelta"}
        </h1>
        <p>
          {isRegister
            ? "Crea tu cuenta y guarda tus notas, ideas y cuadernos en un solo lugar."
            : "Inicia sesión para continuar escribiendo en tus diarios."}
        </p>
      </div>

      <div
        className={`auth-container ${
          isRegister ? "register-mode" : "login-mode"
        }`}
      >
        <Register />
        <Login />

        <div className="overlay-panel">
          <p className="overlay-caption">
            {isRegister ? "¿Ya tienes una cuenta?" : "¿Aún no tienes cuenta?"}
          </p>

          <div className="toggle-buttons">
            <button
              type="button"
              className={`toggle-btn ${!isRegister ? "active" : ""}`}
              onClick={() => setIsRegister(false)}
            >
              Iniciar sesión
            </button>

            <button
              type="button"
              className={`toggle-btn ${isRegister ? "active" : ""}`}
              onClick={() => setIsRegister(true)}
            >
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}