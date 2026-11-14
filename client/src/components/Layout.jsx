import { Link, Outlet } from "react-router-dom";
import { FaBook, FaUserCircle } from "react-icons/fa";

export default function Layout() {
    return (
        <div className="layout">
            <nav className="navbar">
                <Link to="/" className="navbar-logo">
                    { /*ACA VA EL LOGO LUEGO LO PONGO */}
                    Diary Koi
                </Link>
                <div className="navbar-icons">
                    <Link to="/diarios" aria-label="Diarios"><FaBook /></Link>
                    <Link to="/login" aria-label="Iniciar sesión"><FaUserCircle /></Link>        </div>
            </nav>

            <main className="content">
                <Outlet />
            </main>

            <footer className="footer">
                <p>© 2026 Diary Koi</p>
            </footer>
        </div>
    );
}