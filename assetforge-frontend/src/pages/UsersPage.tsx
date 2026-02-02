import { useEffect, useState } from "react";
import api from "../api/axios";
import CreateUser from "../components/CreateUser";
import EditUser from "../components/EditUser";
import type { User } from "../types/User";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading ] = useState(true);

  // Create user
  const [showCreate, setShowCreate ] = useState(false);

  // View user
  const [selectedUser, setSelectedUser ] = useState<User | null>(null);

  // Edit user
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    api.get("/users").then((res) => {
      setUsers(res.data);
      setLoading(false);
    });
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
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}
              className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4">{user.id}</td>
                <td className="py-3 px-4">{user.firstName} {user.lastName}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user.role}</td>

                <td className="py-3 px-4 text-right">
                  <button className="text-blue-600 hover:underline mr-3"
                  onClick={() => {
                    setSelectedUser(user);
                    setShowEdit(true);
                  }}>Edit</button>

                  <button className="text-red-600 hover:underline"
                  onClick={async () => {
                    await api.delete(`/users/${user.id}`);
                    setUsers((prev) => prev.filter((u) => u.id !== user.id));
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
    </>
  )
}