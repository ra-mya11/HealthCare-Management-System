import React, { useState, useEffect } from "react";
import {
  fetchAllDoctors,
  registerDoctor,
  updateDoctor,
  fetchAllUsers,
  fetchAllDepartments,
} from "../../services/adminApi";

function DoctorManagement() {
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    userId: "",
    specialization: "",
    experienceYears: "",
    departmentId: "",
  });

  useEffect(() => {
    fetchDoctorsData();
    fetchUsersData();
    fetchDepartmentsData();
  }, []);

  const fetchDoctorsData = async () => {
    try {
      setLoading(true);
      const data = await fetchAllDoctors();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      alert("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersData = async () => {
    try {
      const data = await fetchAllUsers("DOCTOR");
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchDepartmentsData = async () => {
    try {
      const data = await fetchAllDepartments();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegisterDoctor = async (e) => {
    e.preventDefault();

    if (
      !formData.userId ||
      !formData.specialization ||
      !formData.experienceYears ||
      !formData.departmentId
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editingId) {
        await updateDoctor(editingId, formData);
        alert("Doctor updated successfully");
      } else {
        await registerDoctor(formData);
        alert("Doctor registered successfully");
      }
      resetForm();
      fetchDoctorsData();
    } catch (error) {
      console.error("Failed to save doctor:", error);
      alert(`Error: ${error.message || "Failed to save doctor"}`);
    }
  };

  const handleEdit = (doctor) => {
    setFormData({
      userId: doctor.userId,
      specialization: doctor.specialization,
      experienceYears: doctor.experienceYears.toString(),
      departmentId: doctor.departmentId,
    });
    setEditingId(doctor.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      userId: "",
      specialization: "",
      experienceYears: "",
      departmentId: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getDoctorName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown";
  };

  const getDepartmentName = (departmentId) => {
    const dept = departments.find((d) => d.id === departmentId);
    return dept ? dept.name : "Unknown";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">👨‍⚕️ Doctor Management</h2>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="bg-brand text-white px-6 py-2 rounded-lg hover:bg-brand-dark transition"
        >
          {showForm ? "✕ Cancel" : "+ Register Doctor"}
        </button>
      </div>

      {/* Registration Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">
            {editingId ? "Edit Doctor" : "Register New Doctor"}
          </h3>
          <form onSubmit={handleRegisterDoctor} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor User
                </label>
                <select
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-brand"
                >
                  <option value="">Select a user with DOCTOR role</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  placeholder="e.g., Cardiologist, Neurologist"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleInputChange}
                  placeholder="e.g., 5"
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-brand"
                >
                  <option value="">Select a department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition"
              >
                {editingId ? "Update Doctor" : "Register Doctor"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Doctors List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">
            Loading doctors...
          </div>
        ) : doctors.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No doctors registered yet
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Doctor Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Specialization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {getDoctorName(doctor.userId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {doctor.specialization}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {doctor.experienceYears} years
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {getDepartmentName(doctor.departmentId)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleEdit(doctor)}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Edit
                    </button>
                    <button className="text-gray-400 cursor-not-allowed">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default DoctorManagement;
