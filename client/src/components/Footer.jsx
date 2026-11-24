import { FaGithub } from "react-icons/fa";
import { SiNotion } from "react-icons/si";
import "./Footer.css";

const equipo = [
  "Joanna Olivares",
  "Saul Anaya",
  "Julian Lagunes",
  "Natalia Amparan",
  "Olimpia Navarro",
  "Karla Romero",
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-contenido">
        <div className="footer-info">
          <strong>Diary Koi</strong>
          <p>
            Aplicación web para la creación, edición y organización de diarios
            digitales multimedia.
          </p>
          <span className="footer-materia">
            Proyecto Integral Web · UACJ
          </span>
        </div>

        <div className="footer-equipo">
          <h4>Equipo de desarrollo</h4>
          <ul>
            {equipo.map((nombre) => (
              <li key={nombre}>{nombre}</li>
            ))}
          </ul>
        </div>

        <div className="footer-enlaces">
          <h4>Recursos del proyecto</h4>
          <div className="footer-links-lista">
            <a
              href="https://github.com/JoannaD-Arc/PIW-diarioOnline-MERN"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              <FaGithub />
              <span>Repositorio en GitHub</span>
            </a>

            <a
              href="https://app.notion.com/p/Proyecto-Integral-Web-3e3ea5565f52804dbdbdf51d48a8ab3d?source=copy_link"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              <SiNotion />
              <span>Documentación en Notion</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Diary Koi — Todos los derechos reservados.</span>
        <span>Proyecto Integral Web · 2026</span>
      </div>
    </footer>
  );
}