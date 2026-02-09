import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import type { PasswordErrors } from "../types/PasswordErrors";
import { validateChangePassword } from "../utils/validateChangePassword";

export default function ChangePasswordPage() {
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState<PasswordErrors>({
        currentPassword: null,
        newPassword: null,
        confirmPassword: null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const currentPassword = form.currentPassword.trim();
        const newPassword = form.newPassword.trim();
        const confirmPassword = form.confirmPassword.trim();

        const { errors, isValid } = validateChangePassword({
            currentPassword,
            newPassword,
            confirmPassword,
        });

        setErrors(errors);

        if (!isValid) {
            toast.error("Please fix the errors before submitting");
            return;
        }

        try {
            await api.put("/auth/update-password", form);
            toast.success("Password updated successfully");
            setForm({ currentPassword: "", newPassword: "", confirmPassword: ""});
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Unexpected error occured");
            }
        } finally {
            setLoading(false);
        }
    };

    const clearError = (field: keyof PasswordErrors) => {
        setErrors((prev) => ({ ...prev, [field]: null}));
    }

    return (
        <div className="p-8 max-w-md mx-auto">
            <h1 className="text-xl font-semibold mb-4">Change Password</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <input name="currentPassword"
                    type={showCurrent ? "text" : "password"}
                    placeholder="Current Password"
                    className="border p-2 w-full"
                    value={form.currentPassword}
                    onChange={(e) => {
                        handleChange(e);
                        clearError("currentPassword");
                        }}/>
                    {errors.currentPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                    )}

                    <button type="button"
                    onClick={() => setShowCurrent((prev) => !prev)}
                    className="absolute right-3 top-2 text-sm text-gray-600 hover:text-gray-800">
                        {showCurrent ? "Hide" : "Show"}
                    </button>
                </div>

                <div className="relative">
                    <input name="newPassword"
                    type={showNew ? "text" : "password"}
                    placeholder="New Password"
                    className="border p-2 w-full"
                    value={form.newPassword}
                    onChange={(e) => {
                        handleChange(e);
                        clearError("newPassword");
                        }}/>
                    {errors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                    )}

                    <button type="button"
                    onClick={() => setShowNew((prev) => !prev)}
                    className="absolute right-3 top-2 text-sm text-gray-600 hover:text-gray-800">
                        {showNew ? "Hide" : "Show"}
                    </button>     
                </div>

                <div className="relative">
                    <input name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="border p-2 w-full"
                    value={form.confirmPassword}
                    onChange={(e) => {
                        handleChange(e);
                        clearError("confirmPassword");
                    }}/>
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}

                    <button type="button"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    className="absolute right-3 top-2 text-sm text-gray-600 hover:text-gray-800">
                        {showConfirm ? "Hide" : "Show"}
                    </button>     
                </div>

                <button 
                disabled={loading}
                className="bg-blue-600 text-white w-full py-2 rounded">
                    {loading ? "Updating password..." : "Update password"}
                </button>
            </form>
        </div>
    );
}