// frontend/src/pages/Admin/UsageReports.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const API_URL = "http://localhost:5000/api";

export default function UsageReports() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/reports/checkins-per-day`)
      .then(res => {
        // Recharts expects { date, count }
        const formatted = res.data.map(d => ({ date: d._id, count: d.count }));
        setData(formatted);
      })
      .catch(err => console.error("Report load error:", err));
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Usage Trends (Last 30 Days)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#1976d2" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
