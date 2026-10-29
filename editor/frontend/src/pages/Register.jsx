import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";

export default function Register() {
  const [datos, setDatos] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    confirmar: "",
  });
  const [error, setError] = useState("");

  // un solo handler para todos los campos, usa el atributo name del input
  function cambiar(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  }

  function enviar(e) {
    e.preventDefault();
    if (datos.contrasena !== datos.confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setError("");
    // TODO: llamar a la API de registro cuando el backend esté listo
    console.log(datos);
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

        {error && <p className="auth-error">{error}</p>}

        <Button type="submit">Registrarme</Button>
      </form>

      <p className="auth-link">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </section>
  );
}