import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = 'http://localhost:5009';

export default function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchUsers = async () => {
    const res = await axios.get(`${api}/users`);
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || (!editId && !form.password)) return;

    try {
      if (editId) {
        await axios.put(`${api}/user/${editId}`, {
          name: form.name,
          email: form.email,
        });
      } else {
        await axios.post(`${api}/users`, form);
      }
      setForm({ name: '', email: '', password: '' });
      setEditId(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'An error occurred');
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`${api}/user/${id}`);
    fetchUsers();
  };

  const handleSearch = async () => {
    if (!search) return fetchUsers();
    const res = await axios.get(`${api}/search?name=${search}`);
    setUsers(res.data);
  };

  const startEdit = (user) => {
    setEditId(user.id);
    setForm({ name: user.name, email: user.email, password: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">User Management Dashboard</h1>

        <div className="bg-white shadow-md rounded-md p-4 mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="p-2 border rounded"
              required
            />
            {!editId && (
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="p-2 border rounded"
                required
              />
            )}
            <button
              type="submit"
              className="md:col-span-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition"
            >
              {editId ? 'Update User' : 'Add User'}
            </button>
          </form>
        </div>

        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded w-full max-w-xs"
          />
          <button
            onClick={handleSearch}
            className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>

        <div className="bg-white rounded-md shadow-md overflow-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{user.id}</td>
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => startEdit(user)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
