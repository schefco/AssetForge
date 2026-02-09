import { useEffect, useState } from "react";
import api from "../api/axios";
import CreateUser from "../components/CreateUser";
import EditUser from "../components/EditUser";
import type { User } from "../types/User";
import ResetPasword from "../components/ResetPassword";
import toast from "react-hot-toast";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading ] = useState(true);

  // Create user
  const [showCreate, setShowCreate ] = useState(false);

  // View user
  const [selectedUser, setSelectedUser ] = useState<User | null>(null);

  // Edit user
  const [showEdit, setShowEdit] = useState(false);

  // Reset user password
  const [resetUser, setResetUser] = useState<User | null>(null);
  const openResetPassword = (user: User) => setResetUser(user);
  const closeResetPassword = () => setResetUser(null);

  const fetchUsers = async () => {
    const res = await api.get<User[]>("/users");
    setUsers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    const load = async () => {
      await fetchUsers();
    };
    load()
  }, []);

  return (
    <>
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-semibold mb-6">Users</h1>

      <button onClick={() => setShowCreate(true)}
      className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Add User</button>
    </div>

    <div className="bg-white shadow rounded-lg overflow-hidden p-6">
      {loading && (
        <div className="p-6 text-gray-500">Loading users...</div>
      )}

      {!loading && users.length === 0 && (
        <div className="p-6 text-gray-500">No users found.</div>
      )}

      {!loading && users.length > 0 && (
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-600 border-b">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map(user => (
              <tr key={user.id}
              className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4">{user.id}</td>
                <td className="py-3 px-4">{user.firstName} {user.lastName}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  user.role === "Admin"
                  ? "bg-purple-100 text-purple-700"
                  : user.role === "Technician"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"}`}>
                  {user.role}
                  </span>
                </td>

                <td className="py-3 px-4 text-center">
                  <button className="text-blue-600 hover:underline mr-3"
                  onClick={() => {
                    setSelectedUser(user);
                    setShowEdit(true);
                  }}>Edit</button>

                  <button className="text-orange-800 hover:underline mr-3"
                  onClick={() => {
                    openResetPassword(user)
                  }}>Reset Password</button>

                  <button className="text-red-600 hover:underline"
                  onClick={async () => {
                    try {
                      await api.delete(`/users/${user.id}`);
                      setUsers((prev) => prev.filter((u) => u.id !== user.id));
                      toast.success("User deleted");
                    } catch {
                      toast.error("Failed to delete user");
                    }
                  }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>

    {/*Create User */}
    {showCreate && (
      <CreateUser onClose={() => setShowCreate(false)}
      onCreated={(newUser: User) => setUsers((prev) => [...prev, newUser])}/>
    )}

    {/* Edit User */}
    {showEdit && selectedUser && (
      <EditUser user={selectedUser}
      onClose={() => {
        setShowEdit(false);
        setSelectedUser(null);
      }}
      onUpdated={(updated: User) => setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))}/>
    )}

    {resetUser && (
      <ResetPasword user={resetUser}
      onClose={closeResetPassword}
      onSuccess={fetchUsers} />
    )}
    </>
  );
}