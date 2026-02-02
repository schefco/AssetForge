import api from "../api/axios";
import type { User } from "../types/User";

interface EditUserProps {
    user: User;
    onClose: () => void;
    onUpdated: (user: User) => void;
}

export default function EditUser({ user, onClose, onUpdated }: EditUserProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Edit User</h2>

                <form onSubmit={async (e) => {
                    e.preventDefault();

                    const form = e.target as HTMLFormElement & {
                        firstName: { value: string };
                        lastName: { value: string };
                        email: { value: string };
                        role: { value: string };
                    };

                    const updated = {
                        firstName: form.firstName.value,
                        lastName: form.lastName.value,
                        email: form.email.value,
                        role: form.role.value,
                    };

                    const res = await api.put(`/users/${user.id}`, updated);
                    onUpdated(res.data);
                    onClose();
                }}>

                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">First Name</label>
                        <input name="firstName" defaultValue={user.firstName} className="border p-2 rounded w-full"/>
                    </div>

                    <div className="mb-3">
                        <label className="bloack text-sm font-medium mb-1">Last Name</label>
                        <input name="lastName" defaultValue={user.lastName} className="border p-2 rounded w-full"/>
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input name="email" defaultValue={user.email} className="border p-2 rounded w-full"/>
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <select name="role" defaultValue={user.role} className="border p-2 rounded w-full">
                            <option>User</option>
                            <option>Technician</option>
                            <option>Admin</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded">Cancel</button>

                        <button type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}