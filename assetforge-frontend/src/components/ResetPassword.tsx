import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import type { User } from "../types/User";

interface ResetPasswordProps {
    user: User;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ResetPasword({ user, onClose, onSuccess }: ResetPasswordProps) {
    const [newPassword, setNewPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await api.put(`/users/${user.id}/reset-password`, {
                newPassword,
            });

            toast.success("Password reset successfully");

            onSuccess();
            onClose();
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Unexpected error");
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <form className="bg-white p-6 rounded shadow w-96" onSubmit={handleSubmit}>
                <h2 className="text-lg font-semibold mb-4">Reset Password</h2>

                <div className="relative">
                    <input type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    className="border p-2 w-full mb-4"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}/>

                    <button type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2 text-sm text-gray-600 hover:text-gray-800">
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>

                <button className="bg-blue-600 text-white w-full py-2 rounded">Reset Password</button>
            </form>
        </div>
    );
}