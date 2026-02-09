import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import type { User } from "../types/User";
import type { PasswordErrors } from "../types/PasswordErrors";
import { validateResetPassword } from "../utils/validateResetPassword";

interface ResetPasswordProps {
    user: User;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ResetPasword({ user, onClose, onSuccess }: ResetPasswordProps) {
    const [form, setForm] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [errors, setErrors] = useState<PasswordErrors>({
        newPassword: null,
        confirmPassword: null,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const newPassword = form.newPassword.trim();
        const confirmPassword = form.confirmPassword.trim()

        const {errors, isValid} = validateResetPassword({
            newPassword,
            confirmPassword,
        });

        setErrors(errors);

        if (!isValid) {
            toast.error("Please fix errors before submitting");
            return;
        }

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
        } finally {
            setLoading(false);
        }
    };

    const clearError = (field: keyof PasswordErrors) => {
        setErrors((prev) => ({...prev, [field]: null}))
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <form className="bg-white p-6 rounded shadow w-96" onSubmit={handleSubmit}>
                <h2 className="text-lg font-semibold mb-4">Reset Password</h2>

                <div className="relative">
                    <input name="newPassowrd"
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    className="border p-2 w-full mb-4"
                    value={form.newPassword}
                    onChange={(e) => {
                        handleChange(e);
                        clearError("newPassword");
                    }}/>
                    {errors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                    )}

                    <button type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2 text-sm text-gray-600 hover:text-gray-800">
                        {showPassword ? "Hide" : "Show"}
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

                <button disabled={loading} className="bg-blue-600 text-white w-full py-2 rounded">
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
                
                <button type="button"
                onClick={onClose}
                className="w-full mt-2 py-2 rounded border-gray-300 text-gray-700 hover:bg-gray-100">Cancel</button>
            </form>
        </div>
    );
}