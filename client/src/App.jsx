<<<<<<< HEAD
import { useState } from 'react';

function App() {
  const [mensaje, setMensaje] = useState("");
  const [estado, setEstado] = useState("");

  const enviarDatos = async (e) => {
    e.preventDefault();
    setEstado("Guardando...");

    try {
      
      const respuesta = await fetch("http://localhost:5000/api/prueba", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ mensaje }) 
      });

      if (respuesta.ok) {
        setEstado("¡Éxito! El dato viajó desde React, pasó por el server y se guardó en Atlas.");
        setMensaje("");
      } else {
        setEstado("Hubo un problema al guardar.");
      }
    } catch (error) {
      setEstado("Error de conexión. ¿Está encendido el backend?");
    }
  };
=======
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/protectedRoute.jsx";
import Auth from "./pages/AuthPage.jsx";
import Diary from "./pages/Diary.jsx";
import InsideDiary from "./pages/InsideDiary.jsx";
import Home from "./pages/Home.jsx";
>>>>>>> 59b35f8 (Update: front inicial)

  return (
<<<<<<< HEAD
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h2>Prueba de Conexión a MongoDB</h2>
      <form onSubmit={enviarDatos} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
        <input 
          type="text" 
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe algo para probar..."
          required
          style={{ padding: "8px" }}
        />
        <button type="submit" style={{ padding: "8px", cursor: "pointer", background: "#4CAF50", color: "white", border: "none" }}>
          Guardar en la Nube
        </button>
      </form>
      <p style={{ marginTop: "15px", fontWeight: "bold", color: "#d81b60" }}>{estado}</p>
    </div>
=======
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/diarios" element={<Diary />} />
        <Route path="/diarios/:id" element={<InsideDiary />} />
        <Route path="*" element={<Navigate to="/" replace />} />{" "}
      </Route>
    </Routes>
>>>>>>> 59b35f8 (Update: front inicial)
  );
}

export default App;