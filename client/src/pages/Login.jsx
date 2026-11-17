import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  async function enviar(e) {
    e.preventDefault();

    try {
      const respuesta = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: correo,
          password: contrasena,
        }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        localStorage.setItem("token", datos.token);
        alert("¡Login exitoso! Bienvenida a Diary Koi.");
        navigate("/diarios");
      } else {
        alert("Error: " + (datos.mensaje || "Correo o contraseña incorrectos"));
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert(
        "No se pudo conectar con el servidor. Revisa que el backend esté encendido.",
      );
    }
  }

  return (
    <div className="form-box login-box">
      <div className="avatar-circle">
        <UserIcon />
      </div>
      <form onSubmit={enviar}>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="Correo"
          required
        />
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          placeholder="Contraseña"
          required
        />
        <div className="submit-row">
          <button type="submit" className="btn-submit">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

function UserIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="#e2e8f0">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}
