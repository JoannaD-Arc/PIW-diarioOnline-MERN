import { Link, Outlet, useLocation } from "react-router-dom";
import { FaBook, FaUserCircle } from "react-icons/fa";

// Páginas que usan el tema azul grisáceo y ocupan todo el ancho
const PAGINAS_CON_TEMA = ["/", "/diarios"];

export default function Layout() {
  const conTema = PAGINAS_CON_TEMA.includes(useLocation().pathname);

  return (
    <div className={`layout${conTema ? " tema-koi" : ""}`}>
      <nav className="navbar">
        <Link to="/" className="navbar-logo">
          {/* ACA VA EL LOGO LUEGO LO PONGO */}
          Diary Koi
        </Link>
        <div className="navbar-icons">
          <Link to="/diarios" aria-label="Diarios">
            <FaBook />
          </Link>
          <Link to="/auth" aria-label="Iniciar sesión">
            <FaUserCircle />
          </Link>
        </div>
      </nav>

      <main className={conTema ? "content-full" : "content"}>
        <Outlet />
      </main>

      <footer className="footer">
        <p>© 2026 Diary Koi</p>
      </footer>
    </div>
  );
}
