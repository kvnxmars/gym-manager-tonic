import React, { useState, useEffect } from 'react';
import '../../../styles/WorkoutApp.css';

//** Connect the API calls properly (use backend as a reference) */
//** Fix the start workoiut session page, and instead of MOCK variables, show ACTUAL workouts from student number */
//** Add functionality to add/edit/delete templates and exercises */
//** Add functionality to save workout session */
//** link student number from login to fetch templates */
//**use backend source code as reference, code from
// server.js, routes/templates, and use models to save and track workouts */

const WorkoutApp = () => {
  const [view, setView] = useState('start');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for managing workout templates
  const [workoutTemplates, setWorkoutTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  
  // Mock data for demonstration
  const mockTemplates = [
    {
      id: '1',
      name: 'Upper-Lower',
      category: 'Split Training',
      exercises: []
    },
    {
      id: '2', 
      name: 'Full Body III',
      category: 'Full Body',
      exercises: [
        {
          id: 'ex1',
          name: 'Iso-Lateral Row (Machine)',
          type: 'strength',
          sets: [
            { id: 's1', previous: '40 kg x 6 (W)', weight: '40', reps: '6', completed: false },
            { id: 's2', previous: '70 kg x 12', weight: '70', reps: '12', completed: false },
            { id: 's3', previous: '70 kg x 8', weight: '70', reps: '8', completed: false }
          ]
        },
        {
          id: 'ex2',
          name: 'Lying Leg Curl (Machine)',
          type: 'strength', 
          sets: [
            { id: 's4', previous: '70 kg x 6 (W)', weight: '40', reps: '6', completed: false },
            { id: 's5', previous: '70 kg x 12', weight: '70', reps: '12', completed: false },
            { id: 's6', previous: '70 kg x 8', weight: '70', reps: '8', completed: false }
          ]
        }
      ]
    },
    {
      id: '3',
      name: 'Full Body II', 
      category: 'Full Body',
      exercises: []
    },
    {
      id: '4',
      name: 'Full Body I',
      category: 'Full Body', 
      exercises: []
    }
  ];

  // API Configuration
  const API_URL = "http://localhost:5000/api/templates";
  //get student from login info
  //const studentNumber = how do i get this from login info?;

  // Initialize with mock data
  useEffect(() => {
    setWorkoutTemplates(mockTemplates);
  }, []);

  // API Functions
  const fetchWorkoutTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${studentNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      const data = await response.json();
      setWorkoutTemplates(data.templates || mockTemplates);
    } catch (err) {
      setError(err.message);
      console.error("Fetch templates error:", err);
      // Fallback to mock data
      setWorkoutTemplates(mockTemplates);
    } finally {
      setLoading(false);
    }
  };

  const handleStartWorkout = (template = null) => {
    setCurrentTemplate(template);
    setView('workout');
  };

  const handleTemplateEdit = (template) => {
    setEditingTemplate(template);
    setCurrentTemplate(template);
    setView('workout');
  };

  const handleSetComplete = (exerciseId, setId) => {
    if (!currentTemplate) return;
    
    setCurrentTemplate(prev => ({
      ...prev,
      exercises: prev.exercises.map(exercise => 
        exercise.id === exerciseId 
          ? {
              ...exercise,
              sets: exercise.sets.map(set => 
                set.id === setId ? { ...set, completed: !set.completed } : set
              )
            }
          : exercise
      )
    }));
  };

  const handleAddSet = (exerciseId) => {
    if (!currentTemplate) return;
    
    const newSet = {
      id: `s${Date.now()}`,
      previous: '',
      weight: '',
      reps: '',
      completed: false
    };
    
    setCurrentTemplate(prev => ({
      ...prev,
      exercises: prev.exercises.map(exercise => 
        exercise.id === exerciseId 
          ? { ...exercise, sets: [...exercise.sets, newSet] }
          : exercise
      )
    }));
  };

  const handleSetValueChange = (exerciseId, setId, field, value) => {
    if (!currentTemplate) return;
    
    setCurrentTemplate(prev => ({
      ...prev,
      exercises: prev.exercises.map(exercise => 
        exercise.id === exerciseId 
          ? {
              ...exercise,
              sets: exercise.sets.map(set => 
                set.id === setId ? { ...set, [field]: value } : set
              )
            }
          : exercise
      )
    }));
  };

  const StartScreen = () => (
    
    <div className="workout-app">
        <div className="status-bar">
        <span className="device-name">Fit@NWU</span>
        </div>
      
      <div className="app-content">
        {/* Start Workout Section */}
        <div className="workout-section">
          <h2 className="section-title">Start Workout</h2>
          <button 
            className="primary-button"
            onClick={() => handleStartWorkout()}
          >
            Start an Empty Workout
          </button>
        </div>

        {/* Templates Section */}
        <div className="workout-section">
          <div className="section-header">
            <h2 className="section-title">Templates</h2>
            <button className="add-button">Add Template</button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="templates-grid">
          {workoutTemplates.map(template => (
            <button
              key={template.id}
              className="template-card"
              onClick={() => handleStartWorkout(template)}
            >
              <span className="template-name">{template.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button className="nav-item active">👤</button>
        <button className="nav-item">📈</button>
        <button className="nav-item">📋</button>
        <button className="nav-item">⚙️</button>
      </div>
    </div>
  );

  const WorkoutScreen = () => (
    <div className="workout-app">
      <div className="status-bar">
        <span className="device-name">Fit@NWU</span>
        
        
      </div>

      <div className="workout-header">
        <button className="back-button" onClick={() => setView('start')}>
          ✕
        </button>
        <h1 className="workout-title">
          {currentTemplate ? currentTemplate.name : 'Empty Workout'}
        </h1>
        <button className="save-button">Save</button>
      </div>

      <div className="workout-content">
        {currentTemplate?.exercises?.map(exercise => (
          <div key={exercise.id} className="exercise-section">
            <div className="exercise-header">
              <h3 className="exercise-name">{exercise.name}</h3>
            </div>
            
            <div className="sets-container">
              <div className="sets-header">
                <span className="set-label">Set</span>
                <span className="previous-label">Previous</span>
                <span className="kg-label">kg</span>
                <span className="reps-label">Reps</span>
              </div>
              
              {exercise.sets.map((set, index) => (
                <div key={set.id} className="set-row">
                  <button 
                    className={`set-number ${set.completed ? 'completed' : ''}`}
                    onClick={() => handleSetComplete(exercise.id, set.id)}
                  >
                    {index + 1}
                  </button>
                  <span className="previous-value">{set.previous}</span>
                  <input
                    type="number"
                    className="weight-input"
                    value={set.weight}
                    onChange={(e) => handleSetValueChange(exercise.id, set.id, 'weight', e.target.value)}
                    placeholder="40"
                  />
                  <input
                    type="number" 
                    className="reps-input"
                    value={set.reps}
                    onChange={(e) => handleSetValueChange(exercise.id, set.id, 'reps', e.target.value)}
                    placeholder="12"
                  />
                </div>
              ))}
              
              <button 
                className="add-set-button"
                onClick={() => handleAddSet(exercise.id)}
              >
                + Add Set
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button className="nav-item">👤</button>
        <button className="nav-item active">📈</button>
        <button className="nav-item">📋</button>
        <button className="nav-item">⚙️</button>
      </div>
    </div>
  );

  return view === 'start' ? <StartScreen /> : <WorkoutScreen />;
};

export default WorkoutApp;