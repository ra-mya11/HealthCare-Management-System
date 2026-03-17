import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDoctorAppointments } from "../services/api";
import { removeToken } from "../utils/auth";

function DoctorDashboard({ setAuth }) {
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [patientRecords, setPatientRecords] = useState([]);
  const [user, setUser] = useState(null);

  const [uploadData, setUploadData] = useState({
    patientId: "",
    recordType: "",
    notes: "",
    document: null,
    vitals: { glucose: "", bmi: "", bloodPressure: "", cholesterol: "" },
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
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
      const token = localStorage.getItem("healthcare_token");
      const res = await fetch(`/api/records/patient/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPatientRecords(data.records || []);
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
      await fetch(`/api/appointments/${appointmentId}/status`, {
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
            <button onClick={handleLogout} className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2">
            {["appointments", "records", "upload", "schedule"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === tab ? "border-b-2 border-brand-dark text-brand-dark" : "text-gray-600 hover:text-brand-dark"
                }`}
              >
                {tab === "appointments" ? "📅 My Appointments"
                  : tab === "records" ? "📋 Patient Records"
                  : tab === "upload" ? "📤 Upload Record"
                  : "🕐 My Schedule"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "appointments" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Appointments</h2>
            {appointments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <p className="text-gray-600">No appointments scheduled</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">👤</div>
                          <div>
                            <h3 className="font-semibold text-lg">{apt.patient?.name}</h3>
                            <p className="text-sm text-gray-600">{apt.patient?.email}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Date</p>
                            <p className="font-medium">{apt.scheduledAt}</p>
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
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              apt.status === "SCHEDULED" ? "bg-blue-100 text-blue-700"
                              : apt.status === "COMPLETED" ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                            }`}>
                              {apt.status}
                            </span>
                          </div>
                        </div>

                        {apt.reason && (
                          <div className="mt-3 p-3 bg-gray-50 rounded">
                            <p className="text-sm font-medium text-gray-700">Reason:</p>
                            <p className="text-sm text-gray-600">{apt.reason}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => viewPatientRecords(apt.patient?.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
                        >
                          View Records
                        </button>
                        {apt.status === "SCHEDULED" && (
                          <>
                            <button
                              onClick={() => {
                                const notes = prompt("Enter consultation notes:");
                                if (notes) updateAppointmentStatus(apt.id, "completed", notes);
                              }}
                              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, "cancelled")}
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

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3">🔍 Search Patient Records</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter Patient ID (shown in patient's dashboard header)"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  id="patientIdSearch"
                />
                <button
                  onClick={() => {
                    const id = document.getElementById("patientIdSearch").value.trim();
                    if (id) viewPatientRecords(id);
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Search
                </button>
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("healthcare_token");
                      const res = await fetch("/api/records/all", {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      const data = await res.json();
                      setPatientRecords(Array.isArray(data) ? data : []);
                    } catch { setPatientRecords([]); }
                  }}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  All Records
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Ask the patient to share their User ID visible in their dashboard header.</p>
            </div>

            {patientRecords.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-gray-600">No records found</p>
                <p className="text-sm text-gray-400 mt-2">Search by Patient ID or click All Records</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {patientRecords.map((record) => (
                  <div key={record.recordId || record.id} className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{record.recordType === "ai_prediction" ? "🤖" : "📄"}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-lg capitalize">
                            {record.recordType ? record.recordType.replace(/_/g, " ") : "General"}
                          </h3>
                          {record.verified && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">✓ Verified</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{record.fileName || "Medical Document"}</p>
                        <p className="text-xs text-gray-400 mt-1">Patient ID: {record.patientId}</p>
                        <p className="text-xs text-gray-400">{record.uploadedAt || ""}</p>
                        <div className="mt-3 space-y-1">
                          {record.ipfsHash && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-purple-600 font-medium">🔗 IPFS:</span>
                              <code className="bg-gray-100 px-2 py-1 rounded text-xs">{record.ipfsHash}</code>
                            </div>
                          )}
                          {record.blockchainTxHash && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-blue-600 font-medium">⛓️ TX:</span>
                              <code className="bg-gray-100 px-2 py-1 rounded text-xs">{record.blockchainTxHash}</code>
                            </div>
                          )}
                        </div>
                      </div>
                      {record.ipfsHash && (
                        <a
                          href={`http://127.0.0.1:8090/ipfs/${record.ipfsHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm self-start"
                        >
                          View File
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "upload" && (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
            <h2 className="text-2xl font-bold">Upload Medical Record</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const token = localStorage.getItem("healthcare_token");
                  const userData = localStorage.getItem("user");
                  const doctorId = userData ? JSON.parse(userData).userId || JSON.parse(userData).id || "" : "";

                  const form = new FormData();
                  form.append("patientId", uploadData.patientId);
                  form.append("doctorId", doctorId);
                  form.append("recordType", uploadData.recordType || "general");
                  if (uploadData.notes) form.append("notes", uploadData.notes);
                  if (uploadData.document) {
                    form.append("file", uploadData.document);
                  } else {
                    const blob = new Blob([uploadData.notes || "Medical Record"], { type: "text/plain" });
                    form.append("file", blob, "record.txt");
                  }

                  const res = await fetch("/api/records/upload", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: form,
                  });

                  if (res.ok) {
                    alert("Record uploaded successfully!");
                    setUploadData({ patientId: "", recordType: "", notes: "", document: null, vitals: { glucose: "", bmi: "", bloodPressure: "", cholesterol: "" } });
                  } else {
                    const err = await res.json().catch(() => ({}));
                    alert("Upload failed: " + (err.message || res.statusText));
                  }
                } catch (err) {
                  console.error(err);
                  alert("Upload failed: " + err.message);
                }
              }}
            >
              <div>
                <label className="block text-sm font-medium mb-1">Patient ID *</label>
                {appointments.length > 0 ? (
                  <select
                    value={uploadData.patientId}
                    onChange={(e) => setUploadData({ ...uploadData, patientId: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="">Select patient</option>
                    {appointments.map((a) => (
                      <option key={a.patient?.id} value={a.patient?.id}>
                        {a.patient?.name} ({a.patient?.id})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={uploadData.patientId}
                    onChange={(e) => setUploadData({ ...uploadData, patientId: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    required
                    placeholder="Enter patient ID"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Record Type</label>
                <input
                  value={uploadData.recordType}
                  onChange={(e) => setUploadData({ ...uploadData, recordType: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="e.g. lab_report, prescription"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={uploadData.notes}
                  onChange={(e) => setUploadData({ ...uploadData, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Attach File (PDF/Image)</label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => setUploadData({ ...uploadData, document: e.target.files[0] })}
                  className="w-full"
                />
              </div>
              <button type="submit" className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                Upload
              </button>
            </form>
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">My Weekly Schedule</h2>
            <div className="grid grid-cols-7 gap-4">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <div key={day} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{day}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-blue-50 p-2 rounded">09:00 AM</div>
                    <div className="bg-blue-50 p-2 rounded">10:00 AM</div>
                    <div className="bg-blue-50 p-2 rounded">11:00 AM</div>
                    <div className="bg-gray-100 p-2 rounded text-gray-500">Lunch</div>
                    <div className="bg-blue-50 p-2 rounded">02:00 PM</div>
                    <div className="bg-blue-50 p-2 rounded">03:00 PM</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default DoctorDashboard;
