import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  function enviar(e) {
    e.preventDefault();
    // TODO: llamar a la API de login cuando el backend esté listo
    console.log({ correo, contrasena });
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