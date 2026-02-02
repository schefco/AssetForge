import api from "../api/axios";
import type { User } from "../types/User";

interface CreateUserProps {
    onClose: () => void;
    onCreated: (user: User) => void;
}

export default function CreateUser({ onClose, onCreated }: CreateUserProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Create User</h2>

                <form onSubmit={async (e) => {
                    e.preventDefault();

                    const form = e.target as HTMLFormElement & {
                        firstName: { value: string };
                        lastName: { value: string };
                        email: { value: string };
                        role: { value: string };
                        password: { value: string };
                    };

                    const newUser = {
                        firstName: form.firstName.value,
                        lastName: form.lastName.value,
                        email: form.email.value,
                        role: form.role.value,
                        password: form.password.value,
                    };

                    const res = await api.post("/auth/register", newUser);
                    onCreated(res.data);
                    onClose();
               }}>

                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input name="firstName" className="border p-2 rounded w-full" required />
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input name="lastName" className="border p-2 rounded w-full" required />
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input name="email" className="border p-2 rounded w-full" required />
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select name="role" className="border p-2 rounded w-full">
                        <option>User</option>
                        <option>Technician</option>
                        <option>Admin</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input name="password" type="password" className="border p-2 rounded w-full" required />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 rounded">Cancel</button>

                    <button type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create</button>
                </div>
               </form>
            </div>
        </div>
    )
}