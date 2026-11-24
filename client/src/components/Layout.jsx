import { Link, Outlet, useLocation } from "react-router-dom";
import { FaBook, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/authContext.jsx";
import Footer from "./Footer.jsx";

const PAGINAS_CON_TEMA = ["/", "/diarios"];

export default function Layout() {
  const { usuario } = useAuth();
  const conTema = PAGINAS_CON_TEMA.includes(useLocation().pathname);

  const token =
    localStorage.getItem("token") || localStorage.getItem("diary_koi_token");
  const haySesion = Boolean(usuario || token);

  return (
    <div className={`layout${conTema ? " tema-koi" : ""}`}>
      <nav className="navbar">
        <Link to="/" className="navbar-logo">
          Diary Koi
        </Link>

        <div className="navbar-icons">
          {haySesion ? (
            <>
              <Link to="/diarios" aria-label="Diarios" title="Diarios">
                <FaBook />
              </Link>
              <Link to="/profile" aria-label="Mi perfil" title="Mi perfil">
                <FaUserCircle />
              </Link>
            </>
          ) : (
            <Link to="/auth" className="navbar-register-btn">
              Registrarse
            </Link>
          )}
        </div>
      </nav>

      <main className={conTema ? "content-full" : "content"}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}