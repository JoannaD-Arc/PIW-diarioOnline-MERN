import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/protectedRoute.jsx";
import Auth from "./pages/AuthPage.jsx";
import Diary from "./pages/Diary.jsx";
import InsideDiary from "./pages/InsideDiary.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/diarios" element={<Diary />} />
        <Route path="/diarios/:id" element={<InsideDiary />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
