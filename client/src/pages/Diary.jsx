import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaImage } from "react-icons/fa";
import {
  listarDiarios,
  crearDiario,
  eliminarDiario,
  archivarDiario,
} from "../services/contenidoApi.js";

export default function Diary() {
  const [diarios, setDiarios] = useState([]);
  const [verArchivados, setVerArchivados] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [tagFiltro, setTagFiltro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/auth");
      return;
    }
    listarDiarios()
      .then(setDiarios)
      .catch((error) => console.error("Error al traer diarios:", error))
      .finally(() => setCargando(false));
  }, [navigate]);

  const crear = async () => {
    try {
      const nuevo = await crearDiario();
      setDiarios([nuevo, ...diarios]);
    } catch (error) {
      alert("Error al crear: " + error.message);
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este diario? No se puede deshacer.")) return;
    try {
      await eliminarDiario(id);
      setDiarios(diarios.filter((d) => d._id !== id));
    } catch (error) {
      alert("Error al eliminar: " + error.message);
    }
  };

  const alternarArchivo = async (id) => {
    const diario = diarios.find((d) => d._id === id);
    try {
      const actualizado = await archivarDiario(id, !diario.archivado);
      setDiarios(
        diarios.map((d) =>
          d._id === id ? { ...d, archivado: actualizado.archivado } : d,
        ),
      );
    } catch (error) {
      alert("Error al archivar: " + error.message);
    }
  };

  // Tags que existen en tus diarios (para el select). Hoy el backend no los guarda, así que estará vacío.
  const tagsDisponibles = [...new Set(diarios.flatMap((d) => d.tags || []))];

  const texto = busqueda.trim().toLowerCase();
  const visibles = diarios
    .filter((d) => (d.archivado || false) === verArchivados)
    .filter((d) => d.titulo.toLowerCase().includes(texto))
    .filter((d) => !tagFiltro || (d.tags || []).includes(tagFiltro));

  if (cargando)
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        Cargando tus diarios...
      </p>
    );

  return (
    <div className="diaries-page">
      <section className="diaries">
        <div className="diaries-toolbar">
          <input
            className="diaries-search"
            type="search"
            placeholder="Buscador de diarios por nombre"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <select
            className="diaries-tags"
            value={tagFiltro}
            onChange={(e) => setTagFiltro(e.target.value)}
          >
            <option value="">Buscador de tags</option>
            {tagsDisponibles.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="diaries-btn diaries-btn-ghost"
            onClick={() => setVerArchivados(!verArchivados)}
          >
            {verArchivados ? "Ver activos" : "Ver archivados"}
          </button>

          {!verArchivados && (
            <button
              type="button"
              className="diaries-btn diaries-btn-nuevo"
              onClick={crear}
            >
              Nuevo diario
            </button>
          )}
        </div>

        {visibles.length === 0 ? (
          <p className="diaries-empty">
            {verArchivados
              ? "No tienes diarios archivados."
              : "No hay diarios para mostrar. ¡Crea el primero!"}
          </p>
        ) : (
          <ul className="diaries-grid">
            {visibles.map((d) => (
              <li key={d._id} className="diary-card">
                <Link to={`/diarios/${d._id}`} className="diary-card-link">
                  <div className="diary-card-cover">
                    {d.portada ? <img src={d.portada} alt="" /> : <FaImage />}
                  </div>
                  <h2 className="diary-card-title">{d.titulo}</h2>
                  {d.descripcion && (
                    <p className="diary-card-desc">{d.descripcion}</p>
                  )}
                </Link>

                <div className="diary-card-footer">
                  <div className="diary-card-tags">
                    {(d.tags || []).map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="diary-card-actions">
                    <button
                      type="button"
                      className="card-btn"
                      onClick={() => alternarArchivo(d._id)}
                    >
                      {d.archivado ? "Desarchivar" : "Archivar"}
                    </button>
                    <button
                      type="button"
                      className="card-btn card-btn-danger"
                      onClick={() => eliminar(d._id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="home-strip" />
    </div>
  );
}
