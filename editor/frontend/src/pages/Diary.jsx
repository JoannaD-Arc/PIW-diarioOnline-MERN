import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";

export default function Diary() {
  const [diarios, setDiarios] = useState([]);
  const [verArchivados, setVerArchivados] = useState(false);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const traerDiarios = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/contenido", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const datos = await res.json();
        if (res.ok) setDiarios(datos.data);
      } catch (error) {
        console.error("Error al traer diarios:", error);
      } finally {
        setCargando(false);
      }
    };
    
    traerDiarios();
  }, [navigate]);

  const crear = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/contenido", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo: "Diario sin título",
          contenido: { type: "doc", content: [{ type: "paragraph" }] }
        })
      });

      const datos = await res.json();
      if (res.ok) {
        setDiarios([datos.data, ...diarios]);
      } else {
        alert("Error al crear: " + datos.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este diario? No se puede deshacer.")) return;
    
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/contenido/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        setDiarios(diarios.filter((d) => d._id !== id));
      } else {
        alert("Error al eliminar");
      }
    } catch (error) {
      console.error(error);
    }
  };

  function alternarArchivo(id) {
    setDiarios(
      diarios.map((d) => (d._id === id ? { ...d, archivado: !d.archivado } : d))
    );
  }

  const visibles = diarios.filter((d) => (d.archivado || false) === verArchivados);

  if (cargando) return <p style={{ textAlign: "center", marginTop: "50px" }}>Cargando tus diarios...</p>;

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
            <li key={d._id} className="diary-card">
              <Link to={`/diarios/${d._id}`} className="diary-card-title">
                {d.titulo}
              </Link>
              <div className="diary-card-actions">
                <Button variant="secondary" onClick={() => alternarArchivo(d._id)}>
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