import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginView from "./pages/LoginView";
import DashboardView from "./pages/DashboardView";
import LeadsView from "./pages/LeadsView";
import LeadDetails from "./pages/LeadDetails";
import NotFoundView from "./pages/NotFoundView";
import "./App.css";

const AUTH_STORAGE_KEY = "isLoggedIn";

const getInitialAuthState = () => {
  const savedAuthState = localStorage.getItem(AUTH_STORAGE_KEY);
  return savedAuthState === "true";
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuthState);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_STORAGE_KEY, "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem(AUTH_STORAGE_KEY, "false");
  };

  return (
    <main className="app-shell">
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginView onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <DashboardView onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/leads"
          element={
            isAuthenticated ? (
              <LeadsView onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/leads/:id"
          element={
            isAuthenticated ? (
              <LeadDetails onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="*"
          element={<NotFoundView isAuthenticated={isAuthenticated} />}
        />
      </Routes>
    </main>
  );
}

export default App;
