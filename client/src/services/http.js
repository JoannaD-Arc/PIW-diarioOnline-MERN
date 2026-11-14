const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function pedir(ruta, { body, headers, ...resto } = {}) {
  const token = localStorage.getItem("token");
  const esFormData = body instanceof FormData;

  const res = await fetch(`${BASE}${ruta}`, {
    ...resto,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(body && !esFormData && { "Content-Type": "application/json" }),
      ...headers,
    },
    body: body && !esFormData ? JSON.stringify(body) : body,
  });

  const datos = await res.json().catch(() => ({}));

  // Sesión expirada: el token existía pero el servidor lo rechazó
  if (res.status === 401 && token) {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/login";
  }

  if (!res.ok)
    throw new Error(datos.mensaje || datos.error || "Error en la petición");
  return datos;
}
