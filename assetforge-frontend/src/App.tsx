import { useEffect, useState } from "react";
import { useAuthStore } from "./context/authStore";
import { Routes, Route } from "react-router-dom";
import axios from "./api/axios";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TicketsPage from "./pages/TicketsPage";
import AssetsPage from "./pages/AssetsPage";
import UsersPage from "./pages/UsersPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import FirstAdminPage from "./pages/FirstAdminPage";

export default function App() {
  const loadUser = useAuthStore((s) => s.loadUser);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  const [hasUsers, setHasUsers] = useState<boolean | null>(null);

  // Check if any users exist
  useEffect(() => {
    axios.get("/auth/has-users").then((res) => {
      setHasUsers(res.data);
    });
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Wait for both checks
  if (!isInitialized || hasUsers === null) {
    return <div className="p-8">Loading...</div>;
  }

  // If no users, redirect to First Admin setup
  if (!hasUsers) {
    return <FirstAdminPage />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
