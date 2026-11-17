import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function ProtectedRoute({ children }) {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/auth" replace />;
}
