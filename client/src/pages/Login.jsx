import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";

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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          email: correo, 
          password: contrasena 
        })
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
      alert("No se pudo conectar con el servidor. Revisa que el backend esté encendido.");
    }
  }

  return (
    <section className="auth">
      <h1>Iniciar sesión</h1>

      <form className="auth-form" onSubmit={enviar}>
        <label htmlFor="correo">Correo</label>
        <input
          id="correo"
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="correo@ejemplo.com"
          required
        />

        <label htmlFor="contrasena">Contraseña</label>
        <input
          id="contrasena"
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          placeholder="Tu contraseña"
          required
        />

        <Button type="submit">Entrar</Button>
      </form>

      <p className="auth-link">
        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
      </p>
    </section>
  );
}