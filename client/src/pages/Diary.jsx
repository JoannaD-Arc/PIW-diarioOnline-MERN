import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  listarDiarios,
  crearDiario,
  eliminarDiario,
  archivarDiario,
  guardarContenido,
} from "../services/contenidoApi.js";
import { useTituloPagina } from "../hooks/useTituloPagina";
import "../styles/diaries.css";

const PALETA_DIARIO = [
  "#ffffff",
  "#ffce1f",
  "#e04f38",
  "#2b4c7e",
  "#2d6a4f",
  "#1e1e24",
  "#7b2cbf",
  "#f4a261",
];

function esColorOscuro(hexColor) {
  if (!hexColor) return false;
  const limpio = hexColor.replace("#", "").trim();
  if (limpio.length !== 6) return false;

  const r = parseInt(limpio.slice(0, 2), 16) / 255;
  const g = parseInt(limpio.slice(2, 4), 16) / 255;
  const b = parseInt(limpio.slice(4, 6), 16) / 255;

  const ajustar = (c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const luminancia =
    0.2126 * ajustar(r) + 0.7152 * ajustar(g) + 0.0722 * ajustar(b);

  return luminancia < 0.45;
}

export default function Diary() {
  const [diarios, setDiarios] = useState([]);
  const [verArchivados, setVerArchivados] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [menuColorId, setMenuColorId] = useState(null);
  const navigate = useNavigate();

  useTituloPagina(verArchivados ? "Diarios archivados" : "Mis diarios");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/auth");
      return;
    }
    listarDiarios()
      .then((lista) => {
        setDiarios(
          lista.map((d) => ({
            ...d,
            color: d.color || "#ffffff",
          })),
        );
      })
      .catch((error) => console.error("Error al traer diarios:", error))
      .finally(() => setCargando(false));
  }, [navigate]);

  const crear = async () => {
    try {
      const nuevo = await crearDiario();
      setDiarios([{ ...nuevo, color: nuevo.color || "#ffffff" }, ...diarios]);
    } catch (error) {
      alert("Error al crear: " + error.message);
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este diario? No se puede deshacer.")) return;
    try {
      await eliminarDiario(id);
      if (menuColorId === id) setMenuColorId(null);
      setDiarios(diarios.filter((d) => d._id !== id));
    } catch (error) {
      alert("Error al eliminar: " + error.message);
    }
  };

  const alternarArchivo = async (id) => {
    const diario = diarios.find((d) => d._id === id);
    try {
      const actualizado = await archivarDiario(id, !diario.archivado);
      if (menuColorId === id) setMenuColorId(null);
      setDiarios(
        diarios.map((d) =>
          d._id === id
            ? {
                ...d,
                archivado: actualizado.archivado,
                color: actualizado.color || d.color,
              }
            : d,
        ),
      );
    } catch (error) {
      alert("Error al archivar: " + error.message);
    }
  };

  const alternarMenuColor = (id) => {
    setMenuColorId((prev) => (prev === id ? null : id));
  };

  const cambiarColor = async (id, nuevoColor) => {
    const colorAnterior = diarios.find((d) => d._id === id)?.color || "#ffffff";

    setMenuColorId(null);
    setDiarios((prev) =>
      prev.map((d) => (d._id === id ? { ...d, color: nuevoColor } : d)),
    );

    try {
      await guardarContenido(id, { color: nuevoColor });
    } catch (error) {
      console.error("Error al guardar el color:", error);
      setDiarios((prev) =>
        prev.map((d) => (d._id === id ? { ...d, color: colorAnterior } : d)),
      );
      alert("No se pudo guardar el color del diario.");
    }
  };

  const texto = busqueda.trim().toLowerCase();
  const visibles = diarios
    .filter((d) => (d.archivado || false) === verArchivados)
    .filter((d) => d.titulo.toLowerCase().includes(texto));

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
            {visibles.map((d) => {
              const colorTarjeta = d.color || "#ffffff";
              const oscuro = esColorOscuro(colorTarjeta);
              const estaAbierto = menuColorId === d._id;

              return (
                <li
                  key={d._id}
                  className={`diary-card ${oscuro ? "is-dark" : "is-light"}`}
                  style={{ backgroundColor: colorTarjeta }}
                >
                  <Link to={`/diarios/${d._id}`} className="diary-card-link">
                    <h2 className="diary-card-title">{d.titulo}</h2>
                    {d.descripcion && (
                      <p className="diary-card-desc">{d.descripcion}</p>
                    )}
                  </Link>

                  <div className="diary-card-footer">
                    <div className="diary-card-actions">
                      <div className="diary-color-picker">
                        <button
                          type="button"
                          aria-label="Cambiar color del diario"
                          aria-expanded={estaAbierto}
                          className="color-trigger"
                          style={{ backgroundColor: colorTarjeta }}
                          onClick={() => alternarMenuColor(d._id)}
                        />

                        {estaAbierto && (
                          <div
                            className="color-popover"
                            role="group"
                            aria-label="Colores disponibles"
                          >
                            {PALETA_DIARIO.map((hex) => (
                              <button
                                key={hex}
                                type="button"
                                aria-label={`Color ${hex}`}
                                className={`color-swatch ${
                                  colorTarjeta.toLowerCase() === hex
                                    ? "selected"
                                    : ""
                                }`}
                                style={{ backgroundColor: hex }}
                                onClick={() => cambiarColor(d._id, hex)}
                              />
                            ))}
                          </div>
                        )}
                      </div>

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
              );
            })}
          </ul>
        )}
      </section>

      <div className="home-strip" />
    </div>
  );
}