import React, { useState, useEffect } from "react";
import * as adminApi from "../../services/adminApi";

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await adminApi.fetchAllDepartments();
      setDepartments(res.data);
    } catch (err) {
      console.error("Failed to fetch departments", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createDepartment(formData);
      setFormData({ name: "", description: "" });
      setShowForm(false);
      fetchDepartments();
      alert("Department created successfully!");
    } catch (err) {
      alert(
        "Failed to create department: " +
          (err.response?.data?.message || err.message),
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await adminApi.deleteDepartment(id);
        fetchDepartments();
        alert("Department deleted");
      } catch (err) {
        alert("Failed to delete department");
      }
    }
  };

  if (loading)
    return <div className="text-center py-12">Loading departments...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">🏥 Department Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-brand text-white px-6 py-2 rounded-lg hover:bg-brand-dark transition"
        >
          {showForm ? "Cancel" : "+ Add Department"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <form onSubmit={handleCreateDepartment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Department Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand outline-none"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Cardiology"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand outline-none"
                rows="3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of the department"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brand text-white py-2 rounded-lg hover:bg-brand-dark transition"
            >
              Create Department
            </button>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-bold">{dept.name}</h3>
                <p className="text-gray-600 text-sm mt-2">{dept.description}</p>
              </div>
              <div className="flex gap-2">
                <button className="text-blue-600 hover:text-blue-800 px-3 py-1 border rounded">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(dept.id)}
                  className="text-red-600 hover:text-red-800 px-3 py-1 border rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
