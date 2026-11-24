import { Link } from "react-router-dom";
import { FaPlay, FaQuoteRight, FaArrowRight } from "react-icons/fa";
import videoBanner from "../assets/homevid.mp4";
import videoCrear from "../assets/videoCrear.mp4";
import videoEscribir from "../assets/videoEscribir.mp4";
import videoArchivar from "../assets/videoArchivar.mp4";
import { useTituloPagina } from "../hooks/useTituloPagina";

const secciones = [
  {
    titulo: "Crea tus diarios",
    texto:
      "Empieza un diario nuevo en un clic y ponle el título que quieras. Todos tus diarios quedan guardados en tu cuenta para que los abras desde cualquier lugar.",
    cita: "Tener todo separado por tema hace que volver a escribir sea mucho más fácil.",
    media: videoCrear,
    tipo: "video",
  },
  {
    titulo: "Escribe a tu manera",
    texto:
      "Da formato a tu texto con encabezados, listas, negritas y enlaces, e inserta imágenes que puedes acomodar y cambiar de tamaño.",
    cita: "Es perfecto tanto para ideas rápidas como para entradas más detalladas.",
    media: videoEscribir,
    tipo: "video",
  },
  {
    titulo: "Archiva y ordena",
    texto:
      "Archiva los diarios que ya no usas sin perderlos y recupéralos cuando quieras. Tu pantalla principal se mantiene limpia.",
    cita: "Poder archivar y recuperar cuando quiero hace que todo se sienta ordenado.",
    media: videoArchivar,
    tipo: "video",
  },
];

function Media({ src, alt = "", className = "", tipo = "imagen" }) {
  return (
    <div className={`media ${className}`}>
      {src ? (
        tipo === "video" ? (
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <img src={src} alt={alt} />
        )
      ) : (
        <span className="media-play" aria-hidden="true">
          <FaPlay />
        </span>
      )}
    </div>
  );
}

export default function Home() {
  useTituloPagina();

  const logueado = Boolean(localStorage.getItem("token"));
  const destino = logueado ? "/diarios" : "/auth";

  return (
    <div className="home">
      <div className="home-hero-wrapper">
        <Media className="home-banner" src={videoBanner} tipo="video" />

        <section className="home-hero">
          <h1>Diary Koi</h1>
          <Link to={destino} className="home-btn">
            <span>Comenzar ahora</span>
            <FaArrowRight className="btn-icon" />
          </Link>
        </section>
      </div>

      <div className="home-features">
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
              <Media src={s.media} alt={s.titulo} tipo={s.tipo} />

              <blockquote className="quote">
                <FaQuoteRight className="quote-icon" />
                <p>“{s.cita}”</p>
              </blockquote>
            </div>
          </section>
        ))}
      </div>

      <section className="home-cta">
        <h2>Empieza tu primer cuaderno hoy</h2>
        <p>Gratis, privado y accesible desde cualquier dispositivo.</p>
        <Link to={destino} className="home-btn">
          <span>Comenzar</span>
          <FaArrowRight className="btn-icon" />
        </Link>
      </section>

      <div className="home-strip" />
    </div>
  );
}