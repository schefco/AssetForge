import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function ChangePasswordPage() {
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await api.put("/auth/update-password", form);
            toast.success("password updated successfully");
            setForm({ currentPassword: "", newPassword: ""});
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Unexpected error occured");
            }
        }
    };

    return (
        <div className="p-8 max-w-md mx-auto">
            <h1 className="text-xl font-semibold mb-4">Change Password</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <input name="currentPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Current Password"
                    className="border p-2 w-full"
                    value={form.currentPassword}
                    onChange={handleChange}/>

                    <button type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2 text-sm text-gray-600 hover:text-gray-800">
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>

                <div className="relative">
                    <input name="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    className="border p-2 w-full"
                    value={form.newPassword}
                    onChange={handleChange}/>

                    <button type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2 text-sm text-gray-600 hover:text-gray-800">
                        {showPassword ? "Hide" : "Show"}
                    </button>     
                </div>

                <button className="bg-blue-600 text-white w-full py-2 rounded">Update Password</button>
            </form>
        </div>
    );
}