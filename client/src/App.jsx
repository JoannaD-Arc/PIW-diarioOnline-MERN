import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Diary from "./pages/Diary.jsx";
import InsideDiary from "./pages/InsideDiary.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<h1>Inicio</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/diarios" element={<Diary />} />
        <Route path="/diarios/:id" element={<InsideDiary />} />
      </Route>
    </Routes>
  );
}
