import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listarDiarios } from "../services/contenidoApi.js";
import { useAuth } from "../context/authContext.jsx";
import {
  obtenerPerfilActual,
  actualizarPerfilActual,
  subirImagenPerfil,
  cerrarSesion,
} from "../services/authApi.js";
import { useTituloPagina } from "../hooks/useTituloPagina";
import "../styles/profile.css";

const STORAGE_KEY = "diary_koi_perfil";

const PERFIL_INICIAL = {
  nombre: "",
  correo: "",
  avatarUrl: "",
  biografia: "",
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const inputAvatarRef = useRef(null);
  const auth = useAuth();

  const [user, setUser] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      if (guardado) {
        return { ...PERFIL_INICIAL, ...JSON.parse(guardado) };
      }
    } catch (e) {
      console.error("Error al leer el perfil guardado:", e);
    }
    return PERFIL_INICIAL;
  });

  const [editando, setEditando] = useState(false);
  const [borrador, setBorrador] = useState(user);
  const [guardando, setGuardando] = useState(false);
  const [mensajeEstado, setMensajeEstado] = useState("");
  const [diarios, setDiarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useTituloPagina(user.nombre ? `Perfil de ${user.nombre}` : "Perfil");

  useEffect(() => {
    obtenerPerfilActual()
      .then((data) => {
        const u = data?.usuario || data;
        if (!u) return;
        const datosPerfil = {
          nombre: u.nombre || "",
          correo: u.email || "",
          avatarUrl: u.avatarUrl || "",
          biografia: u.biografia || "",
        };
        setUser(datosPerfil);
        setBorrador(datosPerfil);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(datosPerfil));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    listarDiarios()
      .then((lista) => {
        const activos = lista
          .filter((d) => !d.archivado)
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setDiarios(activos);
      })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  const abrirEditorPerfil = () => {
    setMensajeEstado("");
    setBorrador(user);
    setEditando(true);
  };

  const cancelarEdicion = () => {
    setMensajeEstado("");
    setBorrador(user);
    setEditando(false);
  };

  const handleCerrarSesion = () => {
    cerrarSesion();
    if (typeof auth?.logout === "function") {
      auth.logout();
    } else if (typeof auth?.setUsuario === "function") {
      auth.setUsuario(null);
    }
    navigate("/auth", { replace: true });
  };

  const guardarPerfil = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensajeEstado("");

    try {
      const payload = {
        nombre: borrador.nombre,
        email: borrador.correo || undefined,
        avatarUrl: borrador.avatarUrl,
        biografia: borrador.biografia,
      };

      const data = await actualizarPerfilActual(payload);
      const u = data?.usuario || data || {};

      const nuevoPerfil = {
        nombre: u.nombre ?? borrador.nombre,
        correo: u.email ?? borrador.correo,
        avatarUrl: u.avatarUrl ?? borrador.avatarUrl,
        biografia: u.biografia ?? borrador.biografia,
      };

      setUser(nuevoPerfil);
      setBorrador(nuevoPerfil);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevoPerfil));
      if (typeof auth?.setUsuario === "function") {
        auth.setUsuario((prev) => ({ ...(prev || {}), ...nuevoPerfil }));
      }
      setEditando(false);
      setMensajeEstado("Perfil guardado.");
    } catch (err) {
      setMensajeEstado(err.message || "No se pudo guardar el perfil.");
    } finally {
      setGuardando(false);
    }
  };

  const manejarSeleccionAvatar = async (e) => {
    const archivo = e.target.files?.[0];
    e.target.value = "";
    if (!archivo) return;

    setGuardando(true);
    setMensajeEstado("Subiendo foto...");

    try {
      const urlSubida = await subirImagenPerfil(archivo);
      if (!urlSubida) {
        throw new Error("El servidor no devolvió la URL de la imagen.");
      }
      setBorrador((prev) => ({ ...prev, avatarUrl: urlSubida }));
      setMensajeEstado("Foto lista. Guarda los cambios para aplicarla.");
    } catch (err) {
      setMensajeEstado(err.message || "Error al subir la imagen.");
    } finally {
      setGuardando(false);
    }
  };

  const quitarAvatar = () => {
    setBorrador((prev) => ({ ...prev, avatarUrl: "" }));
  };

  const formatearFecha = (fecha) =>
    new Date(fecha).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const avatarMostrado = editando ? borrador.avatarUrl : user.avatarUrl;
  const inicialNombre = (user.nombre || user.biografia || "K")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="profile-avatar-box">
          <div className="profile-avatar">
            {avatarMostrado ? (
              <img src={avatarMostrado} alt="Foto de perfil" />
            ) : (
              <span className="profile-avatar-placeholder">
                {inicialNombre}
              </span>
            )}
          </div>

          {editando && (
            <div className="profile-avatar-controls">
              <input
                ref={inputAvatarRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: "none" }}
                onChange={manejarSeleccionAvatar}
              />
              <button
                type="button"
                className="profile-btn-sm"
                onClick={() => inputAvatarRef.current?.click()}
                disabled={guardando}
              >
                {borrador.avatarUrl ? "Cambiar foto" : "Subir foto"}
              </button>
              {borrador.avatarUrl && (
                <button
                  type="button"
                  className="profile-btn-sm profile-btn-sm-ghost"
                  onClick={quitarAvatar}
                  disabled={guardando}
                >
                  Quitar
                </button>
              )}
            </div>
          )}
        </div>

        <div className="profile-info">
          {!editando ? (
            <>
              <h2 className="profile-name">
                {user.nombre || "Nombre de usuario"}
              </h2>
              <p className="profile-bio">
                {user.biografia || "Sin biografía todavía."}
              </p>
              {user.correo && <p className="profile-email">{user.correo}</p>}

              {mensajeEstado && (
                <p className="profile-status-msg">{mensajeEstado}</p>
              )}

              <div className="profile-info-actions">
                <button
                  type="button"
                  className="profile-btn profile-btn-outline"
                  onClick={abrirEditorPerfil}
                >
                  Editar perfil
                </button>
                <button
                  type="button"
                  className="profile-btn profile-btn-outline"
                  onClick={handleCerrarSesion}
                >
                  Cerrar sesión
                </button>
              </div>
            </>
          ) : (
            <form className="profile-form" onSubmit={guardarPerfil}>
              <div className="profile-field">
                <label htmlFor="perfil-nombre">Nombre</label>
                <input
                  id="perfil-nombre"
                  type="text"
                  value={borrador.nombre}
                  onChange={(e) =>
                    setBorrador({ ...borrador, nombre: e.target.value })
                  }
                  placeholder="Escribe tu nombre"
                  maxLength={60}
                  required
                />
              </div>

              <div className="profile-field">
                <label htmlFor="perfil-bio">Biografía</label>
                <textarea
                  id="perfil-bio"
                  rows={3}
                  value={borrador.biografia}
                  onChange={(e) =>
                    setBorrador({ ...borrador, biografia: e.target.value })
                  }
                  placeholder="Escribe tu biografía"
                  maxLength={240}
                />
              </div>

              <div className="profile-field">
                <label htmlFor="perfil-correo">Correo electrónico</label>
                <input
                  id="perfil-correo"
                  type="email"
                  value={borrador.correo}
                  onChange={(e) =>
                    setBorrador({ ...borrador, correo: e.target.value })
                  }
                  placeholder="Escribe tu correo"
                  required
                />
              </div>

              {mensajeEstado && (
                <p className="profile-status-msg">{mensajeEstado}</p>
              )}

              <div className="profile-form-actions">
                <button
                  type="submit"
                  className="profile-btn"
                  disabled={guardando}
                >
                  {guardando ? "Guardando..." : "Guardar cambios"}
                </button>
                <button
                  type="button"
                  className="profile-btn profile-btn-outline"
                  onClick={cancelarEdicion}
                  disabled={guardando}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </header>

      <main className="profile-main">
        <h1 className="profile-title">Mis diarios</h1>

        {cargando && <p className="profile-msg">Cargando tus diarios...</p>}

        {error && (
          <p className="profile-msg profile-msg-error">
            No se pudieron cargar tus diarios: {error}
          </p>
        )}

        {!cargando && !error && diarios.length === 0 && (
          <p className="profile-msg">
            Aún no tienes diarios. ¡Crea el primero!
          </p>
        )}

        <div className="profile-grid">
          {diarios.slice(0, 2).map((diario) => (
            <Link
              key={diario._id}
              to={`/diarios/${diario._id}`}
              className="profile-card"
            >
              <h2 className="profile-card-title">{diario.titulo}</h2>
              <p className="profile-card-date">
                Editado el {formatearFecha(diario.updatedAt)}
              </p>
            </Link>
          ))}
        </div>

        <div className="profile-actions">
          <button
            type="button"
            className="profile-btn"
            onClick={() => navigate("/diarios")}
          >
            Nuevo diario
          </button>
          <button
            type="button"
            className="profile-btn profile-btn-outline"
            onClick={() => navigate("/diarios")}
          >
            Ver tus diarios
          </button>
        </div>
      </main>

      <div className="home-strip" />
    </div>
  );
}