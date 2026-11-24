import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      const respuesta = await fetch("/api/auth/register", {
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
        // Opcional: limpiar form o recargar / cambiar estado si deseas
      } else {
        setError(resultado.mensaje || "No se pudo crear la cuenta");
      }
    } catch (error) {
      console.error(error);
      setError("Error de conexión con el servidor");
    }
  }

  return (
    <div className="form-box register-box">
      <div className="avatar-circle">
        <UserIcon />
      </div>
      <form onSubmit={enviar}>
        <input
          name="nombre"
          type="text"
          value={datos.nombre}
          onChange={cambiar}
          placeholder="Nombre de usuario"
          required
        />

        <input
          name="correo"
          type="email"
          value={datos.correo}
          onChange={cambiar}
          placeholder="Correo"
          required
        />

        <input
          name="contrasena"
          type="password"
          value={datos.contrasena}
          onChange={cambiar}
          placeholder="Contraseña"
          required
        />

        <input
          name="confirmar"
          type="password"
          value={datos.confirmar}
          onChange={cambiar}
          placeholder="Confirmar contraseña"
          required
        />

        {error && (
          <p
            className="auth-error"
            style={{ color: "#ff6b6b", fontSize: "12px", margin: 0 }}
          >
            {error}
          </p>
        )}

        <div className="submit-row">
          <button type="submit" className="btn-submit">
            Registrar
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
