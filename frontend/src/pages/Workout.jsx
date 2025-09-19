import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, Save, Trash2, Edit } from 'lucide-react';
import '../styles/Workout.css';

// Mock API endpoint URL - replace with your actual backend URL
const API_URL = "http://localhost:5000/api/templates";

const Workout = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('start');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for managing workout templates
  const [workoutTemplates, setWorkoutTemplates] = useState([]);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [editingTemplate, setEditingTemplate] = useState(null);

  // State for the currently selected workout/exercise
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // --- API Functions ---
  const fetchWorkoutTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      // Dummy API Call
      const response = await fetch(`${API_URL}/${studentNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      const data = await response.json();
      setWorkoutTemplates(data.templates || []);
    } catch (err) {
      setError(err.message);
      console.error("Fetch templates error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTemplate = async () => {
    if (!newTemplateName.trim()) return;

    try {
      // Dummy API Call
      const response = await fetch(`${API_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTemplateName.trim() }),
      });
      if (!response.ok) {
        throw new Error('Failed to create template');
      }
      const data = await response.json();
      setWorkoutTemplates([...workoutTemplates, data.template]);
      setNewTemplateName('');
      setView('start'); // Navigate back to the start page
    } catch (err) {
      setError(err.message);
      console.error("Add template error:", err);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm("Are you sure you want to delete this template?")) return;

    try {
      // Dummy API Call
      const response = await fetch(`${API_URL}/${templateId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete template');
      }
      setWorkoutTemplates(workoutTemplates.filter(t => t._id !== templateId));
    } catch (err) {
      setError(err.message);
      console.error("Delete template error:", err);
    }
  };

  const handleEditTemplate = async () => {
    if (!editingTemplate || !editingTemplate.name.trim()) return;

    try {
      // Dummy API Call
      const response = await fetch(`${API_URL}/${editingTemplate._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingTemplate.name.trim() }),
      });
      if (!response.ok) {
        throw new Error('Failed to update template');
      }
      const updatedTemplate = await response.json();
      setWorkoutTemplates(workoutTemplates.map(t =>
        t._id === updatedTemplate.template._id ? updatedTemplate.template : t
      ));
      setEditingTemplate(null);
      setView('start');
    } catch (err) {
      setError(err.message);
      console.error("Edit template error:", err);
    }
  };

  // Fetch templates on initial component load
  useEffect(() => {
    fetchWorkoutTemplates();
  }, []);

  // --- Component Views ---

  const StartWorkoutPage = () => (
    <div className="h-screen flex flex-col items-center justify-start p-4 text-white gradient-bg">
      <div className="workout-card bg-purple-900 p-6">
        <h2 className="text-2xl font-bold mb-4">Start Workout</h2>
        <button
          onClick={() => setView('select')}
          className="w-full p-3 bg-purple-700 hover:bg-purple-600 rounded-lg text-lg font-semibold transition-colors"
        >
          Start an Empty Workout
        </button>
      </div>

      <div className="workout-card bg-purple-900 p-6">
        <h2 className="text-2xl font-bold mb-4">Templates</h2>
        {loading && <p className="text-gray-400">Loading templates...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {workoutTemplates.length === 0 && !loading && (
          <p className="text-gray-400 text-center">No templates found. <button onClick={() => setView('addTemplate')} className="text-purple-400 underline">Add one</button>!</p>
        )}
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          {workoutTemplates.map(template => (
            <div
              key={template._id}
              className="bg-purple-800 p-6 rounded-lg text-center text-lg font-semibold hover:bg-purple-700 transition-colors cursor-pointer relative group"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingTemplate(template);
                  setView('addTemplate');
                }}
                className="absolute top-2 right-2 p-1 rounded-full bg-purple-600 hover:bg-purple-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Edit size={16} className="text-white" />
              </button>
              {template.name}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTemplate(template._id);
                }}
                className="absolute bottom-2 right-2 p-1 rounded-full bg-red-600 hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const AddTemplatePage = () => (
    <div className="h-screen flex flex-col items-center justify-start p-4 text-white gradient-bg">
      <div className="w-full max-w-sm flex justify-between items-center py-4 text-purple-200">
        <button onClick={() => setView('start')} className="text-xl font-bold p-2 hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <span className="text-lg font-semibold">{editingTemplate ? 'Edit Template' : 'Add Template'}</span>
        <button
          onClick={editingTemplate ? handleEditTemplate : handleAddTemplate}
          className="text-purple-400 font-semibold text-sm p-2 hover:text-purple-300 transition-colors"
        >
          <Save size={20} />
        </button>
      </div>

      <div className="w-full max-w-sm flex-grow rounded-lg shadow-lg overflow-y-auto mb-4 p-4 bg-purple-900 space-y-4 fade-in">
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-gray-400">Template Name</label>
          <input
            type="text"
            placeholder="e.g., Full Body III"
            value={editingTemplate ? editingTemplate.name : newTemplateName}
            onChange={(e) => {
              if (editingTemplate) {
                setEditingTemplate({ ...editingTemplate, name: e.target.value });
              } else {
                setNewTemplateName(e.target.value);
              }
            }}
            className="w-full p-3 bg-gray-700 rounded-lg text-white"
          />
        </div>
      </div>
      <div className="w-full max-w-sm mt-auto mb-16 p-4">
        <button
          onClick={editingTemplate ? handleEditTemplate : handleAddTemplate}
          className="w-full p-3 bg-purple-700 hover:bg-purple-600 rounded-lg text-lg font-semibold transition-colors"
        >
          {editingTemplate ? 'Save Changes' : 'Save Template'}
        </button>
      </div>
    </div>
  );

  // You will still need the SelectWorkoutPage and WorkoutPage components
  // These are not changed in this update as the focus was on template management.

  const renderView = () => {
    switch (view) {
      case 'start':
        return <StartWorkoutPage />;
      case 'addTemplate':
        return <AddTemplatePage />;
      default:
        // You can keep your existing 'select' and 'workout' pages here
        return <StartWorkoutPage />;
    }
  };

  return (
    <div className="App font-sans min-h-screen">
      {renderView()}
    </div>
  );
};

export default Workout;