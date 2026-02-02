import { useEffect } from "react";
import { useAuthStore } from "./context/authStore";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TicketsPage from "./pages/TicketsPage";
import AssetsPage from "./pages/AssetsPage";
import UsersPage from "./pages/UsersPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

export default function App() {
    const loadUser = useAuthStore((s) => s.loadUser);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  useEffect(() => {
    loadUser();
  }, []);

  if (!isInitialized) {
    return <div className="p-8">Loading...</div>;
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
