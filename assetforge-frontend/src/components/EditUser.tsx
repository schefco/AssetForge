import api from "../api/axios";
import type { User } from "../types/User";
import toast from "react-hot-toast";
import { useState } from "react";
import type { EditUserErrors } from "../types/EditUserErrors";
import { validateUser } from "../utils/validateUser";

interface EditUserProps {
    user: User;
    onClose: () => void;
    onUpdated: (user: User) => void;
}

export default function EditUser({ user, onClose, onUpdated }: EditUserProps) {
    const [form, setForm] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
    });

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState<EditUserErrors>({
        firstName: null,
        lastName: null,
        email: null,
        role: null,
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const clearError = (field: keyof EditUserErrors) => {
        setErrors((prev) => ({...prev, [field]: null}));
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Edit User</h2>

                <form onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);

                    const form = e.target as HTMLFormElement & {
                        firstName: { value: string };
                        lastName: { value: string };
                        email: { value: string };
                        role: { value: string };
                    };

                    const firstName = form.firstName.value.trim();
                    const lastName = form.lastName.value.trim();
                    const email = form.email.value.trim();
                    const role = form.role.value.trim();

                    const { errors: validationErrors, isValid } = validateUser({
                        firstName,
                        lastName,
                        email,
                        role,
                    });

                    setErrors(validationErrors);

                    if (!isValid) {
                        toast.error("Please fix the errors before submitting");
                        setLoading(false);
                        return;
                    }

                    const updated = {
                        firstName,
                        lastName,
                        email,
                        role,
                    };

                    try {
                        const res = await api.put(`/users/${user.id}`, updated);
                        onUpdated(res.data);
                        toast.success("User updated succesfully");
                        onClose();
                    } catch {
                        toast.error("Failed to update user");
                    } finally {
                        setLoading(false);
                    }
                }}>

                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">First Name</label>
                        <input name="firstName" 
                        defaultValue={user.firstName} 
                        className="border p-2 rounded w-full"
                        onChange={(e) => {
                            handleChange(e);
                            clearError("firstName");
                        }}/>
                        {errors.firstName && (
                            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Last Name</label>
                        <input name="lastName" 
                        defaultValue={user.lastName} 
                        className="border p-2 rounded w-full"
                        onChange={(e) => {
                            handleChange(e);
                            clearError("lastName");
                        }}/>
                        {errors.lastName && (
                            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input name="email" 
                        defaultValue={user.email} 
                        className="border p-2 rounded w-full"
                        onChange={(e) => {
                            handleChange(e);
                            clearError("email");
                        }}/>
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <select name="role" defaultValue={user.role} 
                        className="border p-2 rounded w-full"
                        onChange={() => {
                            clearError("role");
                        }}>
                            <option>User</option>
                            <option>Technician</option>
                            <option>Admin</option>
                        </select>
                        {errors.role && (
                            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded">Cancel</button>

                        <button type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}