import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDoctorAppointments, getPatientRecords } from "../services/api";
import { removeToken } from "../utils/auth";

function DoctorDashboard({ setAuth }) {
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [patientRecords, setPatientRecords] = useState([]);
  const [user, setUser] = useState(null);

  // upload form state
  const [uploadData, setUploadData] = useState({
    patientId: "",
    recordType: "",
    notes: "",
    document: null,
    vitals: {
      glucose: "",
      bmi: "",
      bloodPressure: "",
      cholesterol: "",
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await getDoctorAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Failed to fetch appointments");
    }
  };

  const viewPatientRecords = async (patientId) => {
    try {
      const records = await getPatientRecords(patientId);
      setPatientRecords(records);
      setActiveTab("records");
    } catch (error) {
      console.error("Failed to fetch patient records");
    }
  };

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("user");
    setAuth(false);
    navigate("/login");
  };

  const updateAppointmentStatus = async (appointmentId, status, notes) => {
    try {
      const urlBase =
        process.env.REACT_APP_API_URL || "http://localhost:5003/api";
      await fetch(`${urlBase}/appointments/${appointmentId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("healthcare_token")}`,
        },
        body: JSON.stringify({ status, notes }),
      });
      fetchAppointments();
    } catch (error) {
      console.error("Failed to update appointment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-brand-dark to-brand-light text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">🏥 Doctor Portal</h1>
            <p className="text-sm opacity-90">Healthcare Management System</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold">Dr. {user?.name}</p>
              <p className="text-sm opacity-90">{user?.specialization}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("appointments")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "appointments"
                  ? "border-b-2 border-brand-dark text-brand-dark"
                  : "text-gray-600 hover:text-brand-dark"
              }`}
            >
              📅 My Appointments
            </button>
            <button
              onClick={() => setActiveTab("records")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "records"
                  ? "border-b-2 border-brand-dark text-brand-dark"
                  : "text-gray-600 hover:text-brand-dark"
              }`}
            >
              📋 Patient Records
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "upload"
                  ? "border-b-2 border-brand-dark text-brand-dark"
                  : "text-gray-600 hover:text-brand-dark"
              }`}
            >
              📤 Upload Record
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "schedule"
                  ? "border-b-2 border-brand-dark text-brand-dark"
                  : "text-gray-600 hover:text-brand-dark"
              }`}
            >
              🕐 My Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "appointments" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Today's Appointments</h2>

            {appointments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <p className="text-gray-600">No appointments scheduled</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {appointments.map((apt) => (
                  <div
                    key={apt._id}
                    className="bg-white rounded-xl shadow-md p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                            👤
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {apt.patient?.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {apt.patient?.email}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Date</p>
                            <p className="font-medium">
                              {new Date(apt.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Time</p>
                            <p className="font-medium">{apt.timeSlot}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Department</p>
                            <p className="font-medium">{apt.department}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Status</p>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                apt.status === "scheduled"
                                  ? "bg-blue-100 text-blue-700"
                                  : apt.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {apt.status}
                            </span>
                          </div>
                        </div>

                        {apt.reason && (
                          <div className="mt-3 p-3 bg-gray-50 rounded">
                            <p className="text-sm font-medium text-gray-700">
                              Reason:
                            </p>
                            <p className="text-sm text-gray-600">
                              {apt.reason}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => viewPatientRecords(apt.patient._id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
                        >
                          View Records
                        </button>
                        {apt.status === "scheduled" && (
                          <>
                            <button
                              onClick={() => {
                                const notes = prompt(
                                  "Enter consultation notes:",
                                );
                                if (notes)
                                  updateAppointmentStatus(
                                    apt._id,
                                    "completed",
                                    notes,
                                  );
                              }}
                              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() =>
                                updateAppointmentStatus(apt._id, "cancelled")
                              }
                              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "records" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Patient Medical Records</h2>

            {patientRecords.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <p className="text-gray-600">
                  Select a patient from appointments to view records
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {patientRecords.map((record) => (
                  <div
                    key={record._id}
                    className="bg-white rounded-xl shadow-md p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">
                        {record.recordType === "ai_prediction" ? "🤖" : "📄"}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg capitalize">
                          {record.recordType.replace("_", " ")}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(record.createdAt).toLocaleString()}
                        </p>

                        {record.vitals && (
                          <div className="mt-4 grid grid-cols-4 gap-3">
                            {record.vitals.glucose && (
                              <div className="bg-blue-50 p-3 rounded">
                                <p className="text-xs text-gray-600">Glucose</p>
                                <p className="font-semibold">
                                  {record.vitals.glucose} mg/dL
                                </p>
                              </div>
                            )}
                            {record.vitals.bmi && (
                              <div className="bg-green-50 p-3 rounded">
                                <p className="text-xs text-gray-600">BMI</p>
                                <p className="font-semibold">
                                  {record.vitals.bmi}
                                </p>
                              </div>
                            )}
                            {record.vitals.bloodPressure && (
                              <div className="bg-red-50 p-3 rounded">
                                <p className="text-xs text-gray-600">BP</p>
                                <p className="font-semibold">
                                  {record.vitals.bloodPressure} mmHg
                                </p>
                              </div>
                            )}
                            {record.vitals.cholesterol && (
                              <div className="bg-yellow-50 p-3 rounded">
                                <p className="text-xs text-gray-600">
                                  Cholesterol
                                </p>
                                <p className="font-semibold">
                                  {record.vitals.cholesterol} mg/dL
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {record.predictions && (
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="border-l-4 border-red-500 pl-3">
                              <p className="text-sm font-medium">
                                Diabetes Risk
                              </p>
                              <p className="text-lg font-bold text-red-600">
                                {record.predictions.diabetes?.risk_level ||
                                  "N/A"}
                              </p>
                            </div>
                            <div className="border-l-4 border-blue-500 pl-3">
                              <p className="text-sm font-medium">
                                Heart Disease Risk
                              </p>
                              <p className="text-lg font-bold text-blue-600">
                                {record.predictions.heartDisease?.risk_level ||
                                  "N/A"}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">My Weekly Schedule</h2>
            <div className="grid grid-cols-7 gap-4">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <div key={day} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{day}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-blue-50 p-2 rounded">09:00 AM</div>
                    <div className="bg-blue-50 p-2 rounded">10:00 AM</div>
                    <div className="bg-blue-50 p-2 rounded">11:00 AM</div>
                    <div className="bg-gray-100 p-2 rounded text-gray-500">
                      Lunch
                    </div>
                    <div className="bg-blue-50 p-2 rounded">02:00 PM</div>
                    <div className="bg-blue-50 p-2 rounded">03:00 PM</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "upload" && (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
            <h2 className="text-2xl font-bold">Upload Medical Record</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const url = `${process.env.REACT_APP_API_URL || "http://localhost:5003"}/records/upload`;
                  let options = {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("healthcare_token")}`,
                    },
                  };
                  if (uploadData.document) {
                    const form = new FormData();
                    Object.entries(uploadData).forEach(([key, val]) => {
                      if (key === "document") {
                        form.append("document", val);
                      } else if (key === "vitals") {
                        form.append("vitals", JSON.stringify(val));
                      } else {
                        form.append(key, val);
                      }
                    });
                    options.body = form;
                  } else {
                    options.headers["Content-Type"] = "application/json";
                    options.body = JSON.stringify(uploadData);
                  }
                  await fetch(url, options);
                  alert("Record uploaded");
                  setUploadData({
                    patientId: "",
                    recordType: "",
                    notes: "",
                    document: null,
                    vitals: {
                      glucose: "",
                      bmi: "",
                      bloodPressure: "",
                      cholesterol: "",
                    },
                  });
                } catch (err) {
                  console.error(err);
                  alert("Upload failed");
                }
              }}
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Patient *
                </label>
                {appointments.length > 0 ? (
                  <select
                    value={uploadData.patientId}
                    onChange={(e) =>
                      setUploadData({
                        ...uploadData,
                        patientId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="">Select patient</option>
                    {appointments.map((a) => (
                      <option key={a.patient._id} value={a.patient._id}>
                        {a.patient.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={uploadData.patientId}
                    onChange={(e) =>
                      setUploadData({
                        ...uploadData,
                        patientId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded"
                    required
                    placeholder="Enter patient ID"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Record Type
                </label>
                <input
                  value={uploadData.recordType}
                  onChange={(e) =>
                    setUploadData({ ...uploadData, recordType: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={uploadData.notes}
                  onChange={(e) =>
                    setUploadData({ ...uploadData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                  rows="3"
                />
              </div>
              <h3 className="text-lg font-medium">Vitals (optional)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Glucose</label>
                  <input
                    value={uploadData.vitals.glucose}
                    onChange={(e) =>
                      setUploadData({
                        ...uploadData,
                        vitals: {
                          ...uploadData.vitals,
                          glucose: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">BMI</label>
                  <input
                    value={uploadData.vitals.bmi}
                    onChange={(e) =>
                      setUploadData({
                        ...uploadData,
                        vitals: { ...uploadData.vitals, bmi: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Blood Pressure</label>
                  <input
                    value={uploadData.vitals.bloodPressure}
                    onChange={(e) =>
                      setUploadData({
                        ...uploadData,
                        vitals: {
                          ...uploadData.vitals,
                          bloodPressure: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Cholesterol</label>
                  <input
                    value={uploadData.vitals.cholesterol}
                    onChange={(e) =>
                      setUploadData({
                        ...uploadData,
                        vitals: {
                          ...uploadData.vitals,
                          cholesterol: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>

              {/* document upload */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Attach File (PDF/Image)
                </label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) =>
                    setUploadData({
                      ...uploadData,
                      document: e.target.files[0],
                    })
                  }
                  className="w-full"
                />
              </div>
              <button
                type="submit"
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
              >
                Upload
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default DoctorDashboard;
