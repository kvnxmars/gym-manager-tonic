import React, { useState, useEffect } from "react";

const ClassBooking = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [bookings, setBookings] = useState([]);

  // Simulate fetching available classes (could come from backend later)
  useEffect(() => {
    setClasses(["Yoga", "Pilates", "Spin Class", "Crossfit"]);
  }, []);

  const handleBooking = async () => {
    if (!selectedClass || !selectedDate) {
      alert("Please select a class and date!");
      return;
    }

    const newBooking = { className: selectedClass, date: selectedDate };

    // Add to local state for instant feedback
    setBookings([...bookings, newBooking]);

    try {
      // Send booking to backend
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBooking),
      });

      if (!response.ok) throw new Error("Failed to save booking");
      console.log("✅ Booking saved to database!");
    } catch (err) {
      console.error("❌ Booking API error:", err);
      alert("Something went wrong while booking. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h2>Book a Class</h2>

      <label>Choose a Class:</label>
      <select
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
      >
        <option value="">-- Select Class --</option>
        {classes.map((cls, index) => (
          <option key={index} value={cls}>{cls}</option>
        ))}
      </select>

      <br /><br />

      <label>Choose a Date:</label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      <br /><br />

      <button onClick={handleBooking}>Book Class</button>

      <h3>Your Bookings:</h3>
      <ul>
        {bookings.map((b, i) => (
          <li key={i}>{b.className} on {b.date}</li>
        ))}
      </ul>
    </div>
  );
};

export default ClassBooking;
