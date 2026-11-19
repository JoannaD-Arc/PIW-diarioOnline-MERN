import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listarDiarios } from "../services/contenidoApi.js";
import "../styles/profile.css";

export default function ProfilePage() {
  const navigate = useNavigate();

  // Aquí luego jalas el usuario real desde tu authContext
  const [user] = useState({
    avatarUrl: "",
    biografia: "Biografia",
    datosPersonales: "Datos Personales",
  });

  const [diarios, setDiarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [sliderValue, setSliderValue] = useState(50);

  useEffect(() => {
    listarDiarios()
      .then((lista) => {
        // Solo los no archivados, del más reciente al más antiguo
        const activos = lista
          .filter((d) => !d.archivado)
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setDiarios(activos);
      })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  const formatearFecha = (fecha) =>
    new Date(fecha).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="profile-avatar">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" />
          ) : (
            <span></span>
          )}
        </div>

        <div className="profile-info">
          <p className="profile-bio">{user.biografia}</p>
          <p className="profile-data">{user.datosPersonales}</p>
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

        {/* Solo los 2 más recientes */}
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
            className="profile-btn"
            onClick={() => navigate("/diarios")}
          >
            Ver tus diarios
          </button>
        </div>
      </main>
    </div>
  );
}
