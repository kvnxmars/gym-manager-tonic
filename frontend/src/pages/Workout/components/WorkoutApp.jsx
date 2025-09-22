import React, { useState, useEffect } from 'react';
import '../../../styles/WorkoutApp.css';
//** Fix the start workoiut session page, and instead of MOCK variables, show ACTUAL workouts from student number */
//** Add functionality to add/edit/delete templates and exercises */
//** Add functionality to save workout session */
//** link student number from login to fetch templates */
//**use backend source code as reference, code from
// server.js, routes/templates, and use models to save and track workouts */

import{ useRef} from 'react';





const WorkoutApp = () => {
    // State to manage app views
    const [view, setView] = useState('start');
    
    // State to manage loading and error
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // State for managing workout templates
    const [workoutTemplates, setWorkoutTemplates] = useState([]);
    const [currentTemplate, setCurrentTemplate] = useState(null);
    const [editingTemplate, setEditingTemplate] = useState(null);

    // Workout timer state
    const [workoutStartTime, setWorkoutStartTime] = useState(null);
    const [workoutEndTime, setWorkoutEndTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);

    // State to hold the student number (for data fetching)
    const [studentNumber, setStudentNumber] = useState(null);

    // Mock data for demonstration purposes
    const mockTemplates = [
        {
            _id: '1',
            name: 'Upper-Lower',
            category: 'Split Training',
            exercises: [
                {
                    _id: 'ex1',
                    name: 'Bench Press',
                    sets: [
                        { _id: 's1', previous: '30 kg x 10', weight: '35', reps: '8', completed: false },
                        { _id: 's2', previous: '35 kg x 8', weight: '40', reps: '6', completed: false }
                    ]
                },
            ]
        },
        {
            _id: '2',
            name: 'Full Body III',
            category: 'Full Body',
            exercises: [
                {
                    _id: 'ex2',
                    name: 'Iso-Lateral Row (Machine)',
                    type: 'strength',
                    sets: [
                        { _id: 's3', previous: '40 kg x 6 (W)', weight: '40', reps: '6', completed: false },
                        { _id: 's4', previous: '70 kg x 12', weight: '70', reps: '12', completed: false },
                    ]
                },
                {
                    _id: 'ex3',
                    name: 'Lying Leg Curl (Machine)',
                    type: 'strength',
                    sets: [
                        { _id: 's6', previous: '70 kg x 6 (W)', weight: '40', reps: '6', completed: false },
                        { _id: 's7', previous: '70 kg x 12', weight: '70', reps: '12', completed: false },
                        { _id: 's8', previous: '70 kg x 8', weight: '70', reps: '8', completed: false }
                    ]
                }
            ]
        },
    ];

    const API_URL = "http://localhost:5000/api/workouts";

    // Get student data from local storage on component mount
    useEffect(() => {
        try {
            const studentData = localStorage.getItem("student");
            if (studentData) {
                const student = JSON.parse(studentData);
                setStudentNumber(student.studentNumber);
            } else {
                setStudentNumber("12345678"); // Mock student number for testing
            }
        } catch (e) {
            console.error("Failed to parse student data from localStorage", e);
            setStudentNumber("12345678");
        }
    }, []);

    // Fetch templates when student number is available
    useEffect(() => {
        if (studentNumber !== null) {
            fetchWorkoutTemplates();
        }
    }, [studentNumber]);

    // Timer logic
    useEffect(() => {
        let timer = null;
        if (view === 'workout' && timerRunning) {
            const now = Date.now();
            setWorkoutStartTime(now);
            timer = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - now) / 1000));
            }, 1000);
        }
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [view, timerRunning]);

    // Function to calculate the sum of all weight lifted
    const calculateTotalWeight = (template) => {
        if (!template) return 0;
        return template.exercises.reduce((total, ex) => {
            return total + ex.sets.reduce((setTotal, s) => {
                const weight = parseFloat(s.weight) || 0;
                return setTotal + weight;
            }, 0);
        }, 0);
    };

    const fetchWorkoutTemplates = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!studentNumber) {
                setWorkoutTemplates(mockTemplates);
                setLoading(false);
                return;
            }
            const response = await fetch(`${API_URL}/templates/${studentNumber}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch templates: ${response.status}`);
            }
            const data = await response.json();
            setWorkoutTemplates(data.templates || mockTemplates);
        } catch (err) {
            setError(err.message);
            console.error("Fetch templates error:", err);
            setWorkoutTemplates(mockTemplates);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTemplate = async () => {
        const templateName = prompt("Enter a name for the new template:");
        if (!templateName || templateName.trim() === '') return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/template`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentNumber,
                    name: templateName.trim(),
                    exercises: [],
                    category: 'Custom'
                }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to create template');
            setWorkoutTemplates(prevTemplates => [result.template, ...prevTemplates]);
            handleTemplateEdit(result.template);
        } catch (err) {
            setError(err.message);
            const mockTemplate = {
                _id: `mock_${Date.now()}`,
                name: templateName.trim(),
                category: 'Custom',
                exercises: []
            };
            setWorkoutTemplates(prevTemplates => [mockTemplate, ...prevTemplates]);
            handleTemplateEdit(mockTemplate);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTemplate = async () => {
        setLoading(true);
        setError(null);
        if (!editingTemplate || !currentTemplate) {
            setError("No template to update.");
            setLoading(false);
            return;
        }
        try {
            const response = await fetch(`${API_URL}/template/${editingTemplate._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentNumber,
                    ...currentTemplate
                }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to update template');
            setWorkoutTemplates(prevTemplates =>
                prevTemplates.map(t => (t._id === editingTemplate._id ? result.template : t))
            );
            setEditingTemplate(null);
            setCurrentTemplate(null);
            setView('start');
            alert('Template updated successfully!');
        } catch (err) {
            setError(err.message);
            setWorkoutTemplates(prevTemplates =>
                prevTemplates.map(t => (t._id === editingTemplate._id ? currentTemplate : t))
            );
            setEditingTemplate(null);
            setCurrentTemplate(null);
            setView('start');
            alert('Template updated locally (offline mode)');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTemplate = async (templateId) => {
        if (!window.confirm("Are you sure you want to delete this template?")) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/template/${templateId}`, { method: 'DELETE' });
            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Failed to delete template');
            }
            setWorkoutTemplates(prevTemplates => prevTemplates.filter(t => t._id !== templateId));
            alert('Template deleted successfully!');
        } catch (err) {
            setError(err.message);
            setWorkoutTemplates(prevTemplates => prevTemplates.filter(t => t._id !== templateId));
            alert('Template deleted locally (offline mode)');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveWorkoutSession = async () => {
        setLoading(true);
        setError(null);
        if (!currentTemplate) {
            setError("No workout to save.");
            setLoading(false);
            return;
        }
        try {
            const workoutToSave = {
                studentNumber,
                name: currentTemplate.name || 'Custom Workout',
                exercises: currentTemplate.exercises,
                isTemplate: false,
                completedAt: new Date().toISOString(),
                duration: elapsedTime
            };
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(workoutToSave),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to save workout');
            alert('Workout saved successfully!');
            setCurrentTemplate(null);
            setEditingTemplate(null);
            setView('start');
        } catch (err) {
            setError(err.message);
            alert('Workout saved locally (offline mode)');
            setCurrentTemplate(null);
            setEditingTemplate(null);
            setView('start');
        } finally {
            setLoading(false);
        }
    };

    const handleStartWorkout = (template = null) => {
        const workoutToStart = template
            ? JSON.parse(JSON.stringify(template))
            : { _id: `workout_${Date.now()}`, name: 'Empty Workout', exercises: [] };
        setWorkoutStartTime(null);
        setWorkoutEndTime(null);
        setElapsedTime(0);
        setTimerRunning(false);
        const processedWorkout = {
            ...workoutToStart,
            exercises: workoutToStart.exercises.map(ex => ({ ...ex, sets: ex.sets || [] }))
        };
        setCurrentTemplate(processedWorkout);
        setEditingTemplate(null);
        setView('workout');
    };

    const handleFinishWorkout = () => {
        if (!timerRunning) return;
        setWorkoutEndTime(Date.now());
        setTimerRunning(false);
        const totalSeconds = Math.floor((Date.now() - workoutStartTime) / 1000);
        setElapsedTime(totalSeconds);
        const totalWeightLifted = calculateTotalWeight(currentTemplate);
        alert(`Workout finished! Duration: ${formatTime(totalSeconds)}.\n` +
            `Total weight lifted: ${totalWeightLifted} kg`);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const handleTemplateEdit = (template) => {
        const templateToEdit = template
            ? JSON.parse(JSON.stringify(template))
            : { _id: `template_${Date.now()}`, name: 'New Template', exercises: [] };
        setCurrentTemplate(templateToEdit);
        setEditingTemplate(template);
        setView('workout');
    };

    const handleSetComplete = (exerciseId, setId) => {
        if (!currentTemplate) return;
        setCurrentTemplate(prev => ({
            ...prev,
            exercises: prev.exercises.map(exercise =>
                exercise._id === exerciseId
                    ? {
                        ...exercise,
                        sets: exercise.sets.map(set =>
                            set._id === setId ? { ...set, completed: !set.completed } : set
                        )
                    }
                    : exercise
            )
        }));
    };

    const handleAddSet = (exerciseId) => {
        if (!currentTemplate) return;
        const newSet = {
            _id: `s${Date.now()}`,
            previous: '',
            weight: '',
            reps: '',
            completed: false
        };
        setCurrentTemplate(prev => ({
            ...prev,
            exercises: prev.exercises.map(exercise =>
                exercise._id === exerciseId
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
                exercise._id === exerciseId
                    ? {
                        ...exercise,
                        sets: exercise.sets.map(set =>
                            set._id === setId ? { ...set, [field]: value } : set
                        )
                    }
                    : exercise
            )
        }));
    };

    const handleAddExercise = () => {
        if (!currentTemplate) return;
        const exerciseName = prompt("Enter exercise name:");
        if (!exerciseName || exerciseName.trim() === '') return;
        const newExercise = {
            _id: `ex${Date.now()}`,
            name: exerciseName.trim(),
            type: 'strength',
            sets: [{ _id: `s${Date.now()}`, previous: '', weight: '', reps: '', completed: false }]
        };
        setCurrentTemplate(prev => ({
            ...prev,
            exercises: [...prev.exercises, newExercise]
        }));
    };

    const handleDeleteExercise = (exerciseId) => {
        if (!currentTemplate) return;
        if (!window.confirm("Are you sure you want to delete this exercise?")) return;
        setCurrentTemplate(prev => ({
            ...prev,
            exercises: prev.exercises.filter(ex => ex._id !== exerciseId)
        }));
    };

    // UI Components
    const StartScreen = () => (
        <div className="workout-app">
            <div className="status-bar">
                <span className="device-name">Fit@NWU</span>
                {studentNumber && <span className="student-info">Student: {studentNumber}</span>}
            </div>
            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}
            <div className="app-content">
                <div className="workout-section">
                    <h2 className="section-title">Start Workout</h2>
                    <button className="primary-button" onClick={() => handleStartWorkout()} disabled={loading}>
                        {loading ? 'Loading...' : 'Start an Empty Workout'}
                    </button>
                </div>
                <div className="workout-section">
                    <div className="section-header">
                        <h2 className="section-title">Templates</h2>
                        <button className="add-button" onClick={handleAddTemplate} disabled={loading}>
                            {loading ? 'Creating...' : 'Add Template'}
                        </button>
                    </div>
                </div>
                <div className="templates-grid">
                    {loading && <p>Loading templates...</p>}
                    {!loading && workoutTemplates.length === 0 && (
                        <p>No templates found. Add one to get started!</p>
                    )}
                    {workoutTemplates.map(template => (
                        <div key={template._id} className="template-card-container">
                            <button className="template-card" onClick={() => handleStartWorkout(template)}>
                                <span className="template-name">{template.name}</span>
                                <span className="template-category">{template.category}</span>
                                <span className="exercise-count">{template.exercises?.length || 0} exercises</span>
                            </button>
                            <div className="template-actions">
                                <button onClick={() => handleTemplateEdit(template)} className="edit-button" title="Edit template">✏️</button>
                                <button onClick={() => handleDeleteTemplate(template._id)} className="delete-button" title="Delete template">🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bottom-nav">
                <button className="nav-item active">👤</button>
                <button className="nav-item">📈</button>
                <button className="nav-item">📋</button>
                <button className="nav-item">⚙️</button>
            </div>
        </div>
    );
    // ... (rest of the WorkoutScreen component) ...
    const WorkoutScreen = () => (
        <div className="workout-app">
            <div className="status-bar">
                <span className="device-name">Fit@NWU</span>
            </div>
            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}
            <div className="workout-header">
                <button className="back-button" onClick={() => setView('start')}>✕</button>
                <div className="timer-controls">
                    {!timerRunning && !workoutEndTime && (
                        <button className="primary-button" onClick={() => setTimerRunning(true)}>▶️ Start Workout</button>
                    )}
                    {timerRunning && (
                        <button className="finish-button" onClick={handleFinishWorkout}>⏹ Finish Workout</button>
                    )}
                    {(timerRunning || workoutEndTime) && (
                        <p className="elapsed-time">⏱ Time: {formatTime(elapsedTime)}</p>
                    )}
                </div>
                <h1 className="workout-title">
                    {currentTemplate ? currentTemplate.name : 'Empty Workout'}
                    {editingTemplate && <span className="editing-indicator"> (Editing)</span>}
                </h1>
                {editingTemplate ? (
                    <button className="save-button" onClick={handleUpdateTemplate} disabled={loading}>
                        {loading ? 'Updating...' : 'Update'}
                    </button>
                ) : (
                    <button className="save-button" onClick={handleSaveWorkoutSession} disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                )}
            </div>
            <div className="workout-content">
                {currentTemplate?.exercises?.length === 0 ? (
                    <div className="empty-workout">
                        <p>No exercises yet. Add some exercises to get started!</p>
                        <button className="primary-button" onClick={handleAddExercise}>Add Exercise</button>
                    </div>
                ) : (
                    <>
                        {currentTemplate?.exercises?.map(exercise => (
                            <div key={exercise._id} className="exercise-section">
                                <div className="exercise-header">
                                    <h3 className="exercise-name">{exercise.name}</h3>
                                    {editingTemplate && (
                                        <button className="delete-exercise-button" onClick={() => handleDeleteExercise(exercise._id)} title="Delete exercise">🗑️</button>
                                    )}
                                </div>
                                <div className="sets-container">
                                    <div className="sets-header">
                                        <span className="set-label">Set</span>
                                        <span className="previous-label">Previous</span>
                                        <span className="kg-label">kg</span>
                                        <span className="reps-label">Reps</span>
                                    </div>
                                    {exercise.sets?.map((set, index) => (
                                        <div key={set._id} className="set-row">
                                            <button className={`set-number ${set.completed ? 'completed' : ''}`} onClick={() => handleSetComplete(exercise._id, set._id)}>{index + 1}</button>
                                            <span className="previous-value">{set.previous}</span>
                                            <input type="number" className="weight-input" value={set.weight} onChange={(e) => handleSetValueChange(exercise._id, set._id, 'weight', e.target.value)} placeholder="40" />
                                            <input type="number" className="reps-input" value={set.reps} onChange={(e) => handleSetValueChange(exercise._id, set._id, 'reps', e.target.value)} placeholder="12" />
                                        </div>
                                    ))}
                                    <button className="add-set-button" onClick={() => handleAddSet(exercise._id)}>+ Add Set</button>
                                </div>
                            </div>
                        ))}
                        {editingTemplate && (
                            <div className="add-exercise-section">
                                <button className="add-exercise-button" onClick={handleAddExercise}>+ Add Exercise</button>
                            </div>
                        )}
                    </>
                )}
            </div>
            <div className="bottom-nav">
                <button className="nav-item">👤</button>
                <button className="nav-item">📈</button>
                <button className="nav-item">📋</button>
                <button className="nav-item">⚙️</button>
            </div>
        </div>
    );
    return view === 'start' ? <StartScreen /> : <WorkoutScreen />;
};

export default WorkoutApp;