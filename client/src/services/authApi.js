import { pedir } from "./http";

export const registrar = (nombre, email, password) =>
  pedir("/auth/register", {
    method: "POST",
    body: { nombre, email, password },
  });

export const iniciarSesion = (email, password) =>
  pedir("/auth/login", { method: "POST", body: { email, password } });

export const obtenerPerfilActual = () =>
  pedir("/auth/me", { method: "GET" });

export const actualizarPerfilActual = (datos) =>
  pedir("/auth/me", {
    method: "PATCH",
    body: datos,
  });

export const subirImagenPerfil = async (archivo) => {
  const formData = new FormData();
  formData.append("imagen", archivo);

  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_API_URL || "/api";

  const resp = await fetch(`${baseUrl}/imagenes`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data.error || data.mensaje || "No se pudo subir la imagen.");
  }

  return data.url || "";
};

export const cerrarSesion = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("diary_koi_perfil");
  window.dispatchEvent(new Event("auth-change"));
};