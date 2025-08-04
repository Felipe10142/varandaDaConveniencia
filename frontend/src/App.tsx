import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import AdminPage from "./pages/Admin";
import PrivateRoute from "./components/auth/PrivateRoute";
import "./assets/css/fonts.css";
import { SocketProvider } from "./contexts/SocketContext";
import CursorEffects from "./components/CursorEffects";
import { useAuth } from "./contexts/AuthContext";

export function App() {
  const { isAuthenticated, loading } = useAuth();
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Carregando...
      </div>
    );
  return (
    <Router>
      <SocketProvider>
        <div className="flex flex-col min-h-screen bg-white">
          <CursorEffects />
          <Header />
          <main className="flex-grow">
            <Routes>
              {!isAuthenticated ? (
                <>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="*" element={<LoginPage />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<HomePage />} />
                  <Route
                    path="/admin/*"
                    element={
                      <PrivateRoute adminOnly={true}>
                        <AdminPage />
                      </PrivateRoute>
                    }
                  />
                  <Route path="*" element={<HomePage />} />
                </>
              )}
            </Routes>
          </main>
          <Footer />
        </div>
      </SocketProvider>
    </Router>
  );
}
