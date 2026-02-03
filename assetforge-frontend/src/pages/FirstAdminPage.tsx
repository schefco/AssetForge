import { useState } from "react";
import api from "../api/axios";
import axios from "axios";

export default function FirstAdminPage() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await api.post("/auth/register", {
                ...form,
                role: "Admin" // Default role for first user
            });
            setMessage("Admin account created. Redirecting to login.");
            
            // Redirect to login
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setMessage(err.response?.data || "Error creating admin");
            } else {
                setMessage("Unexpected error");
            }
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit}
            className="bg-white p-8 rounded shadow-md w-96 space-y-4">
                <h1 className="text-xl font-semibold">Create First Admin</h1>

                <input name="firstName"
                placeholder="First Name"
                className="border p-2 w-full"
                onChange={handleChange}/>

                <input name="lastName"
                placeholder="Last Name"
                className="border p-2 w-full"
                onChange={handleChange}/>

                <input name="email"
                placeholder="Email"
                className="border p-2 w-full"
                onChange={handleChange}/>

                <div className="relative">
                    <input name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="border p-2 w-full"
                    onChange={handleChange}/>

                    <button type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2 text-sm text-gray-600 hover:text-gray-800">
                        {showPassword ? "Hide" : "Show"}
                    </button>        
                </div>

                <button type="submit"
                className="bg-blue-600 text-white w-full py-2 rounded">Create Admin</button>

                {message && <p className="text-center text-sm mt-2">{message}</p>}
            </form>
        </div>
    );
}