import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";

export default function App() {
  const isAuthed = Boolean(localStorage.getItem("token"));

  return (
    <Routes>
      <Route path="/auth" element={isAuthed ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={isAuthed ? "/" : "/auth"} replace />} />
    </Routes>
  );
}
