import { pedir } from "./http";

export const registrar = (nombre, email, password) =>
  pedir("/auth/register", {
    method: "POST",
    body: { nombre, email, password },
  });

export const iniciarSesion = (email, password) =>
  pedir("/auth/login", { method: "POST", body: { email, password } });
