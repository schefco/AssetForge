import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../context/authStore";

export default function MainLayout() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isInitialized = useAuthStore((state) => state.isInitialized);

    if (!isInitialized) {
        return <div className="p-6 text-gray-600">Loading ...</div>
    }

    console.log("MAINLAYOUT USER:", user);
    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-gray-900 text-white flex flex-col p-6">
                <h1 className="text-2xl font-bold mb-8">AssetForge</h1>

                <nav className="flex flex-col gap-4">
                    <NavLink to="/" className={({ isActive }) =>
                        `p-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
                    }>
                        Dashboard
                    </NavLink>

                    <NavLink to="/tickets" className={({ isActive }) =>
                        `p-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
                    }>
                        Tickets
                    </NavLink>

                    <NavLink to="/assets" className={({ isActive }) =>
                        `p-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
                    }>
                        Assets
                    </NavLink>

                    {user?.role === "Admin" && (
                        <NavLink to="/users" className={({ isActive }) =>
                            `p-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
                        }>
                            Users
                        </NavLink>
                    )}

                    <NavLink to="/change-password" className={({ isActive }) => 
                    `p-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
                }>
                    Change Password
                </NavLink>
                </nav>

                <button
                    onClick={handleLogout}
                    className="mt-auto bg-red-600 hover:bg-red-700 p-2 rounded text-white"
                >
                    Logout
                </button>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}