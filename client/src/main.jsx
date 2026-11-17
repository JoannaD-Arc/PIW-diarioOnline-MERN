<<<<<<< HEAD
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
=======
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/index.css";
import { AuthProvider } from "./context/authContext.jsx";
import App from "./App.jsx";
>>>>>>> 578920f (Avance de frontend)

createRoot(document.getElementById("root")).render(
  <StrictMode>
<<<<<<< HEAD
    <App />
=======
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
>>>>>>> 578920f (Avance de frontend)
  </StrictMode>,
)
