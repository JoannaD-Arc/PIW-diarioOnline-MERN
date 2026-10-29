import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";

// SOLO PARA PRUEBAS: datos falsos hasta conectar la API
const DIARIOS_PRUEBA = [
  { id: "000000000000000000000001", titulo: "Mi primer diario", archivado: false },
  { id: "000000000000000000000002", titulo: "Ideas de viaje", archivado: false },
  { id: "000000000000000000000003", titulo: "Diario viejo", archivado: true },
];

export default function Diary() {
  const [diarios, setDiarios] = useState(DIARIOS_PRUEBA);
  const [verArchivados, setVerArchivados] = useState(false);

  function crear() {
    // TODO: POST a la API; el id lo va a dar MongoDB
    const nuevo = {
      id: String(Date.now()),
      titulo: "Diario sin título",
      archivado: false,
    };
    setDiarios([nuevo, ...diarios]);
  }

  function alternarArchivo(id) {
    // TODO: PUT/PATCH a la API
    setDiarios(
      diarios.map((d) => (d.id === id ? { ...d, archivado: !d.archivado } : d))
    );
  }

  function eliminar(id) {
    // TODO: DELETE a la API
    if (!window.confirm("¿Eliminar este diario? No se puede deshacer.")) return;
    setDiarios(diarios.filter((d) => d.id !== id));
  }

  const visibles = diarios.filter((d) => d.archivado === verArchivados);

  return (
    <section className="diaries">
      <header className="diaries-header">
        <h1>{verArchivados ? "Diarios archivados" : "Mis diarios"}</h1>
        <div className="diaries-actions">
          <Button variant="secondary" onClick={() => setVerArchivados(!verArchivados)}>
            {verArchivados ? "Ver activos" : "Ver archivados"}
          </Button>
          {!verArchivados && <Button onClick={crear}>Nuevo diario</Button>}
        </div>
      </header>

      {visibles.length === 0 ? (
        <p className="diaries-empty">
          {verArchivados ? "No tienes diarios archivados." : "Aún no tienes diarios. ¡Crea el primero!"}
        </p>
      ) : (
        <ul className="diaries-grid">
          {visibles.map((d) => (
            <li key={d.id} className="diary-card">
              <Link to={`/diarios/${d.id}`} className="diary-card-title">
                {d.titulo}
              </Link>
              <div className="diary-card-actions">
                <Button variant="secondary" onClick={() => alternarArchivo(d.id)}>
                  {d.archivado ? "Desarchivar" : "Archivar"}
                </Button>
                <Button variant="danger" onClick={() => eliminar(d.id)}>
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