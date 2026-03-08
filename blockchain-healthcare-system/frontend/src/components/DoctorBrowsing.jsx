import React, { useState, useEffect } from "react";
import {
  getAvailableDoctors,
  bookAppointment,
  getAppointments,
} from "../services/api";

function DoctorBrowsing() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [bookingData, setBookingData] = useState({
    date: "",
    timeSlot: "",
    reason: "",
  });

  const departments = [
    "All Departments",
    "Cardiology",
    "Endocrinology",
    "General Medicine",
    "Neurology",
  ];

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  useEffect(() => {
    console.log("DoctorBrowsing component mounted");
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      console.log("Fetching appointments...");
      const data = await getAppointments();
      console.log("Appointments data:", data);
      setAppointments(data);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      console.log("Fetching doctors...");
      setLoading(true);
      const data = await getAvailableDoctors();
      console.log("Doctors data:", data);
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentFilter = (department) => {
    setSelectedDepartment(department);
    if (department === "All Departments") {
      setFilteredDoctors(doctors);
    } else {
      setFilteredDoctors(
        doctors.filter((doc) => doc.specialization === department),
      );
    }
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      if (!selectedDoctor) return;

      await bookAppointment({
        doctorId: selectedDoctor._id,
        date: bookingData.date,
        timeSlot: bookingData.timeSlot,
        department: selectedDoctor.specialization,
        reason: bookingData.reason,
      });

      alert("✅ Appointment booked successfully!");
      setShowBookingModal(false);
      setSelectedDoctor(null);
      setBookingData({ date: "", timeSlot: "", reason: "" });
      fetchDoctors();
      fetchAppointments();
    } catch (error) {
      console.error("Booking error:", error);
      alert("❌ Failed to book appointment. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {console.log(
        "DoctorBrowsing rendering, doctors:",
        doctors,
        "loading:",
        loading,
      )}
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          👨‍⚕️ Browse Doctors
        </h2>
        <p className="text-gray-600">
          Select a doctor and book your appointment
        </p>
      </div>

      {/* Your Appointments Section */}
      {appointments.length > 0 && (
        <div className="bg-green-50 rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <h3 className="text-xl font-bold text-green-800 mb-4">
            📅 Your Appointments
          </h3>
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt._id}
                className="bg-white rounded p-4 flex items-start justify-between"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    Dr. {apt.doctor?.name}
                  </p>
                  <p className="text-sm text-gray-600">{apt.department}</p>
                  <p className="text-sm text-gray-600">
                    📅{" "}
                    {new Date(apt.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    at {apt.timeSlot}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
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
            ))}
          </div>
        </div>
      )}

      {/* Department Filter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Filter by Department</h3>
        <div className="flex flex-wrap gap-3">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => handleDepartmentFilter(dept)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedDepartment === dept
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 text-lg">
            No doctors found in this department
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
            >
              {/* Doctor Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                <div className="text-4xl mb-2">👨‍⚕️</div>
                <h3 className="text-xl font-bold">{doctor.name}</h3>
                <p className="text-blue-100">{doctor.specialization}</p>
              </div>

              {/* Doctor Details */}
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span>📞</span> {doctor.phone || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span>📧</span> {doctor.email}
                  </p>
                  {doctor.licenseNumber && (
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span>🎓</span> {doctor.licenseNumber}
                    </p>
                  )}
                </div>

                {/* Availability Info */}
                {doctor.availability && doctor.availability.length > 0 && (
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm font-medium text-blue-900 mb-2">
                      Available:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {doctor.availability.map((avail) => (
                        <span
                          key={avail.day}
                          className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded"
                        >
                          {avail.day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <button
                  onClick={() => handleSelectDoctor(doctor)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  📅 Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-6">
            {/* Close Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Book Appointment</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Doctor Info */}
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-gray-600">Booking with</p>
              <p className="text-lg font-bold text-blue-600">
                {selectedDoctor.name}
              </p>
              <p className="text-sm text-gray-600">
                {selectedDoctor.specialization}
              </p>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={bookingData.date}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, date: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time Slot *
                </label>
                <select
                  required
                  value={bookingData.timeSlot}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, timeSlot: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Choose a time...</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit
                </label>
                <textarea
                  value={bookingData.reason}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, reason: e.target.value })
                  }
                  placeholder="Describe your symptoms or reason for consultation..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorBrowsing;
