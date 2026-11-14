import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";

export default function Register() {
  const [datos, setDatos] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    confirmar: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function cambiar(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  }

  async function enviar(e) {
    e.preventDefault();
    
    if (datos.contrasena !== datos.confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setError("");

    try {
      const respuesta = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: datos.nombre,
          email: datos.correo,
          password: datos.contrasena,
        }),
      });

      const resultado = await respuesta.json();

      if (respuesta.ok) {
        alert("¡Cuenta creada con éxito! Ya puedes iniciar sesión.");
        navigate("/login"); 
      } else {
        setError(resultado.mensaje || "No se pudo crear la cuenta");
      }
    } catch (error) {
      console.error(error);
      setError("Error de conexión con el servidor");
    }
  }

  return (
    <section className="auth">
      <h1>Crear cuenta</h1>

      <form className="auth-form" onSubmit={enviar}>
        <label htmlFor="nombre">Nombre</label>
        <input id="nombre" name="nombre" value={datos.nombre} onChange={cambiar} required />

        <label htmlFor="correo">Correo</label>
        <input id="correo" name="correo" type="email" value={datos.correo} onChange={cambiar} required />

        <label htmlFor="contrasena">Contraseña</label>
        <input id="contrasena" name="contrasena" type="password" value={datos.contrasena} onChange={cambiar} required />

        <label htmlFor="confirmar">Confirmar contraseña</label>
        <input id="confirmar" name="confirmar" type="password" value={datos.confirmar} onChange={cambiar} required />

        {error && <p className="auth-error" style={{ color: "red" }}>{error}</p>}

        <Button type="submit">Registrarme</Button>
      </form>

      <p className="auth-link">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </section>
  );
}