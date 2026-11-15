import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import {
  listarDiarios,
  crearDiario,
  eliminarDiario,
  archivarDiario,
} from "../services/api.js";

export default function Diary() {
  const [diarios, setDiarios] = useState([]);
  const [verArchivados, setVerArchivados] = useState(false);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
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

  const visibles = diarios.filter(
    (d) => (d.archivado || false) === verArchivados,
  );

  if (cargando)
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        Cargando tus diarios...
      </p>
    );

  return (
    <section className="diaries">
      <header className="diaries-header">
        <h1>{verArchivados ? "Diarios archivados" : "Mis diarios"}</h1>
        <div className="diaries-actions">
          <Button
            variant="secondary"
            onClick={() => setVerArchivados(!verArchivados)}
          >
            {verArchivados ? "Ver activos" : "Ver archivados"}
          </Button>
          {!verArchivados && <Button onClick={crear}>Nuevo diario</Button>}
        </div>
      </header>

      {visibles.length === 0 ? (
        <p className="diaries-empty">
          {verArchivados
            ? "No tienes diarios archivados."
            : "Aún no tienes diarios. ¡Crea el primero!"}
        </p>
      ) : (
        <ul className="diaries-grid">
          {visibles.map((d) => (
            <li key={d._id} className="diary-card">
              <Link to={`/diarios/${d._id}`} className="diary-card-title">
                {d.titulo}
              </Link>
              <div className="diary-card-actions">
                <Button
                  variant="secondary"
                  onClick={() => alternarArchivo(d._id)}
                >
                  {d.archivado ? "Desarchivar" : "Archivar"}
                </Button>
                <Button variant="danger" onClick={() => eliminar(d._id)}>
                  Eliminar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
