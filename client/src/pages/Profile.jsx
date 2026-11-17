import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listarDiarios } from "../services/api.js";

export default function ProfilePage() {
  const navigate = useNavigate();

  // Aquí luego jalas el usuario real desde tu authContext
  const [user] = useState({
    bannerUrl: "",
    avatarUrl: "",
    biografia: "Biografia",
    datosPersonales: "Datos Personales",
  });

  const [diarios, setDiarios] = useState([]);
  const [sliderValue, setSliderValue] = useState(50);

  useEffect(() => {
    // Aquí llamas al mismo endpoint o contexto que usa Diary.jsx
    // Ejemplo con datos de prueba:
    const data = [
      {
        _id: "1",
        titulo: "Titulo del cuaderno",
        descripcion: "Descripcion del cuaderno",
        portada: "",
        tags: ["Tag", "Tag"],
      },
      {
        _id: "2",
        titulo: "Titulo del cuaderno",
        descripcion: "Descripcion del cuaderno",
        portada: "",
        tags: ["Tag", "Tag"],
      },
    ];
    setDiarios(data);
  }, []);

  return (
    <div className="bg-[#2b3541] text-white font-sans">
      {/* Banner y Perfil */}
      <section className="relative bg-[#47535e]">
        <div className="h-52 bg-[#5a6773] flex items-center justify-center">
          {user.bannerUrl ? (
            <img
              src={user.bannerUrl}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-20 h-16 bg-[#7a8692] rounded flex items-center justify-center text-2xl">
              🖼️
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto px-8 pb-8 relative">
          <div className="w-36 h-36 rounded-full bg-[#7a8692] border-4 border-[#47535e] -mt-20 flex items-center justify-center overflow-hidden">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-5xl text-white">👤</span>
            )}
          </div>

          <div className="mt-4 space-y-1">
            <p className="text-lg font-medium">{user.biografia}</p>
            <p className="text-lg text-gray-200">{user.datosPersonales}</p>
            <div className="pt-3">
              <button
                onClick={() => navigate("/editar-perfil")}
                className="bg-[#f0f2f5] text-[#2b3541] text-sm font-medium px-5 py-2 rounded hover:bg-white transition"
              >
                Cambiar perfil
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Mis Diarios */}
      <main className="max-w-6xl w-full mx-auto px-8 py-10">
        <h1 className="text-4xl font-normal mb-8">Mis diarios</h1>

        {/* Mostramos solo 2 en el perfil */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {diarios.slice(0, 2).map((diario) => (
            <div
              key={diario._id}
              onClick={() => navigate(`/diarios/${diario._id}`)}
              className="border border-[#5a6773] p-6 flex flex-col justify-between bg-[#2b3541] cursor-pointer hover:border-white transition"
            >
              <div className="h-56 bg-[#5a6773] flex items-center justify-center mb-6">
                {diario.portada ? (
                  <img
                    src={diario.portada}
                    alt={diario.titulo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl">🖼️</span>
                )}
              </div>

              <div className="flex flex-col items-center space-y-3 mb-6">
                <div className="border border-[#7a8692] px-4 py-1.5 text-sm text-gray-300 w-3/5 text-center">
                  {diario.titulo}
                </div>
                <div className="border border-[#7a8692] px-4 py-1.5 text-sm text-gray-300 w-4/5 text-center">
                  {diario.descripcion}
                </div>
              </div>

              <div className="flex gap-2 mt-auto pt-2">
                {diario.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-[#8c98a4] text-[#2b3541] text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Slider */}
        <div className="my-10 flex items-center">
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={(e) => setSliderValue(e.target.value)}
            className="w-full h-1 bg-[#5a6773] rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>

        {/* Botones conectados a tus rutas existentes */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => navigate("/diarios")}
            className="bg-[#f0f2f5] text-[#2b3541] font-medium px-8 py-3 rounded hover:bg-white transition"
          >
            Nuevo diario
          </button>
          <button
            onClick={() => navigate("/diarios")}
            className="bg-[#f0f2f5] text-[#2b3541] font-medium px-8 py-3 rounded hover:bg-white transition"
          >
            Ver tus diarios
          </button>
        </div>
      </main>
    </div>
  );
}
