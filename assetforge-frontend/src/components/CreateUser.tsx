import api from "../api/axios";
import type { User } from "../types/User";
import { useState } from "react";
import toast from "react-hot-toast";
import { validateUser } from "../utils/validateUser";
import type { UserErrors } from "../utils/validateUser";

interface CreateUserProps {
    onClose: () => void;
    onCreated: (user: User) => void;
}

export default function CreateUser({ onClose, onCreated }: CreateUserProps) {
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState<UserErrors>({
        firstName: null,
        lastName: null,
        email: null,
        role: null,
        password: null,
    });

    const clearError = (field: keyof UserErrors) => {
        setErrors((prev) => ({ ...prev, [field]: null}));
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Create User</h2>

                <form onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);

                    const form = e.target as HTMLFormElement & {
                        firstName: { value: string };
                        lastName: { value: string };
                        email: { value: string };
                        role: { value: string };
                        password: { value: string };
                    };

                    const firstName =  form.firstName.value.trim();
                    const lastName = form.lastName.value.trim();
                    const email = form.email.value.trim();
                    const role = form.role.value.trim();
                    const password = form.password.value.trim()

                    const { errors: validationErrors, isValid } = validateUser({
                        firstName,
                        lastName,
                        email,
                        role,
                        password,
                    });

                    setErrors(validationErrors);

                    if (!isValid) {
                        toast.error("Please fix the errors before submitting");
                        setLoading(false);
                        return;
                    }

                    const newUser = {
                        firstName,
                        lastName,
                        email,
                        role,
                        password,
                    };

                    try {
                        const res = await api.post("/auth/register", newUser);
                        onCreated(res.data);
                        toast.success("User created successfully");
                        onClose();
                    } catch {
                        toast.error("Failed to create user");
                    } finally {
                        setLoading(false);
                    }
               }}>

                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input name="firstName" 
                    className="border p-2 rounded w-full" 
                    onChange={() => clearError("firstName")}/>
                    {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input name="lastName" 
                    className="border p-2 rounded w-full" 
                    onChange={() => clearError("lastName")} />
                    {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input name="email" 
                    className="border p-2 rounded w-full" 
                    onChange={() => clearError("email")} />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select name="role" 
                    className="border p-2 rounded w-full"
                    onChange={() => clearError("role")}>
                        <option> </option>
                        <option>User</option>
                        <option>Technician</option>
                        <option>Admin</option>
                    </select>
                    {errors.role && (
                        <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                    )}
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <div className="relative">
                        <input name="password"
                        type={showPassword ? "text" : "password"}
                        className="border p-2 rounded w-full"
                        onChange={() => clearError("password")}/>

                        <button type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-2 text-sm text-gray-600 hover:text-gray-800">
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 rounded">Cancel</button>

                    <button type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        {loading ? "Creating user ..." : "Create User"}
                    </button>
                </div>
               </form>
            </div>
        </div>
    );
}