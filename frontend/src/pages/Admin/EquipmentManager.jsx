import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export default function EquipmentManager() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: "", category: "", quantity: 1, location: "", notes: "" });
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    const res = await axios.get(`${API_URL}/equipment`);
    setList(res.data);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await axios.put(`${API_URL}/equipment/${editingId}`, form);
        setList(prev => prev.map(i => i._id === editingId ? res.data : i));
        setEditingId(null);
      } else {
        const res = await axios.post(`${API_URL}/equipment`, form);
        setList(prev => [res.data, ...prev]);
      }
      setForm({ name: "", category: "", quantity: 1, location: "", notes: "" });
    } catch (err) {
      alert("Save failed");
    }
  };

  const handleEdit = (it) => {
    setForm(it);
    setEditingId(it._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/equipment/${id}`);
    setList(prev => prev.filter(i => i._id !== id));
  };

  return (
    <div className="equipment-page">
      <h2>Manage Equipment</h2>

      <form onSubmit={handleSave} className="equipment-form">
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
        <input placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} />
        <input type="number" value={form.quantity} onChange={e=>setForm({...form,quantity:parseInt(e.target.value||1)})} />
        <input placeholder="Location" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} />
        <input placeholder="Notes" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} />
        <button type="submit">{editingId ? "Update" : "Add"} Equipment</button>
        {editingId && <button type="button" onClick={()=>{setForm({name:"",category:"",quantity:1,location:"",notes:""});setEditingId(null);}}>Cancel</button>}
      </form>

      <h3>Equipment list</h3>
      <ul className="equipment-list">
        {list.map(it => (
          <li key={it._id}>
            <strong>{it.name}</strong> — {it.category || "general"} — qty: {it.quantity} — {it.location || "-"}
            <p>{it.notes}</p>
            <button onClick={()=>handleEdit(it)}>✏️ Edit</button>
            <button onClick={()=>handleDelete(it._id)}>🗑️ Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
