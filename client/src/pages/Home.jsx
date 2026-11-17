import { Link } from "react-router-dom";
import { FaPlay, FaQuoteRight } from "react-icons/fa";

const secciones = [
  {
    titulo: "Crea tus diarios",
    texto:
      "Empieza un diario nuevo en un clic y ponle el título que quieras. Todos tus diarios quedan guardados en tu cuenta para que los abras desde cualquier lugar.",
    cita: "Totalmente de acuerdo. ¡Buen trabajo!",
    imagen: null,
  },
  {
    titulo: "Escribe a tu manera",
    texto:
      "Da formato a tu texto con encabezados, listas, negritas y enlaces, e inserta imágenes que puedes acomodar y cambiar de tamaño.",
    cita: "Totalmente de acuerdo. ¡Buen trabajo!",
    imagen: null,
  },
  {
    titulo: "Archiva y ordena",
    texto:
      "Archiva los diarios que ya no usas sin perderlos y recupéralos cuando quieras. Tu pantalla principal se mantiene limpia.",
    cita: "Totalmente de acuerdo. ¡Buen trabajo!",
    imagen: null,
  },
];

// Cuadro de imagen/video. Sin "src" muestra el botón de play de relleno.
function Media({ src, alt = "", className = "" }) {
  return (
    <div className={`media ${className}`}>
      {src ? (
        <img src={src} alt={alt} />
      ) : (
        <span className="media-play" aria-hidden="true">
          <FaPlay />
        </span>
      )}
    </div>
  );
}

export default function Home() {
  const logueado = Boolean(localStorage.getItem("token"));
  const destino = logueado ? "/diarios" : "/auth";
  
  return (
    <div className="home">
      <section className="home-hero">
        <h1>Diary Koi</h1>
        <Link to={destino} className="home-btn">
          Comenzar
        </Link>
      </section>

      <Media className="home-banner" />

      {secciones.map((s, i) => (
        <section
          key={s.titulo}
          className={`feature${i % 2 === 1 ? " feature-invertida" : ""}`}
        >
          <div className="feature-text">
            <h2>{s.titulo}</h2>
            <p>{s.texto}</p>
          </div>

          <div className="feature-media">
            <Media src={s.imagen} alt={s.titulo} />
            <blockquote className="quote">
              <FaQuoteRight className="quote-icon" />
              <p>“{s.cita}”</p>
            </blockquote>
          </div>
        </section>
      ))}

      <section className="home-cta">
        <Link to={destino} className="home-btn">
          Comenzar
        </Link>
      </section>

      <div className="home-strip" />
    </div>
  );
}
