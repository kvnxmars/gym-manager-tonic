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



    // Mock data

    /*const mockTemplates = [

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

    ];*/



    const API_URL = "http://localhost:5000/api";



    // Get student data from local storage

    useEffect(() => {

        try {

            const studentData = localStorage.getItem("student");

            if (studentData) {

                const student = JSON.parse(studentData);

                setStudentNumber(student.studentNumber);

            } else {

                setStudentNumber("12345678");

            }

        } catch (e) {

            console.error("Failed to parse student data", e);

            setStudentNumber("12345678");

        }

    }, []);



    // Fetch templates

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



    // Calculate total weight

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

        console.log("Fetching templates for student:", studentNumber);
        console.log('Student Number:', studentNumber); // Debug log
        console.log('API URL:', `${API_URL}/templates/${studentNumber}`); // Debug log

        setLoading(true);

        setError(null);

        try {

            if (!studentNumber) {
                console.warn("No student number available, skipping fetch");

                setWorkoutTemplates([]);

                setLoading(false);

                return;

            }

            const response = await fetch(`${API_URL}/templates/${studentNumber}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.log('Fetch error response:', errorText); // Debug log

                throw new Error(`Failed to fetch templates: ${response.status}`);

            }

            const data = await response.json();
            console.log('Fetched templates data:', data); // Debug log
            console.log('Templates:', data.templates?.length); // Debug log

            //no undefined data
            const templates = data.templates || data || [];

            console.log('Processed templates:', templates); // Debug log
            setWorkoutTemplates(templates);

        } catch (err) {

            console.error("Error fetching templates:", err);    

            setError(err.message);

            setWorkoutTemplates(mockTemplates);

        } finally {

            setLoading(false);

        }

    };



    // --- handlers ---

    const handleAddTemplate = async () => {

     

   

    try {

        // ✅ Ask user for template name

        const templateName = prompt("Enter a name for your new template:");

        if (!templateName || templateName.trim() === "") {

            alert("Template name cannot be empty.");

            return;

        }



        const newTemplate = {

            _id: `template_${Date.now()}`,

            name: templateName.trim(), // ✅ Use user-provided name

            category: "Custom",

            exercises: [],

        };



        // ✅ Optimistically update UI

        setWorkoutTemplates(prev => [...prev, newTemplate]);



        // ✅ Optionally send to backend if API is available

        try {

            const response = await fetch(`${API_URL}/templates`, {

                method: "POST",

                headers: { "Content-Type": "application/json" },

                body: JSON.stringify({

                    studentNumber,

                    template: newTemplate,

                }),

            });



            if (!response.ok) {

                throw new Error(`Failed to save template: ${response.status}`);

            }

        }

        catch (apiError) {

            console.warn("Template created locally but failed to sync with server", apiError);

        }



        // ✅ Open it for editing immediately

        setCurrentTemplate(newTemplate);

        setEditingTemplate(newTemplate);

        setView("workout");



    } catch (err) {

        console.error("Failed to create template:", err);

        alert("Could not create template. Please try again.");

    }

    };

    const handleUpdateTemplate = async () => { 
        console.log('Starting handleUpdateTemplate');
        console.log('Current Template:', currentTemplate);
        console.log('Editing Template:', editingTemplate);

        if (!currentTemplate) {
            console.error('No current template to update');
            alert('No template to update.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            //validate template data
            if (!currentTemplate.name || currentTemplate.name.trim() === '') {
                alert('Template name cannot be empty.');
                setLoading(false);
                return;
            }

            // Clean up the template data before saving
        const templateToUpdate = {
            ...currentTemplate,
            name: currentTemplate.name.trim(),
            exercises: currentTemplate.exercises.map(exercise => {
                console.log('Processing exercise:', exercise.name);
                return {
                    ...exercise,
                    name: exercise.name.trim(),
                    //keep all sets, even empty ones (user might want to fill them later)
                    sets: exercise.sets.map(set => ({
                        ...set,
                        weight: set.weight || '',
                        reps: set.reps || '',
                        completed: set.completed || false
                    }))
                };

                    
                }).filter(exercise => {
                    // only filter out exercises with no name
                    const hasName = exercise.name && exercise.name.trim() !== '';
                    console.log('Exercise:', exercise.name, 'has name:', hasName);
                    return hasName;
                })
            };

            console.log('Final template to up[date:', JSON.stringify(templateToUpdate, null, 2));

            console.log('Template to update:', templateToUpdate);

            //if this is a new template (add it for the first time)
            if (editingTemplate === null || !editingTemplate._id) {
                console.log('Saving as new template');

                setWorkoutTemplates(prev => {
                    const existingIndex = prev.findIndex(t => t._id === templateToUpdate._id);

                    if (existingIndex !== -1) {
                        // Update existing template
                        const updated = [...prev];
                        updated[existingIndex] = templateToUpdate;
                        return updated;
                    } else {
                        // Add new template
                        return [...prev, templateToUpdate];
                    }
                });

                //try to save to backend
                try {
                    const response = await fetch(`${API_URL}/templates`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            studentNumber,
                            template: templateToUpdate,
                        }),
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('API error response:', errorText);
                        throw new Error(`Failed to save template: ${response.status}`);
                    }

                    const savedTemplate = await response.json();
                    console.log('Template saved to backend:', savedTemplate);

                    //update with backend response (in case of new ID)
                    if(savedTemplate.template) {
                        setCurrentTemplate(savedTemplate.template);
                        setWorkoutTemplates(prev => prev.map(t => t._id === templateToUpdate._id ? savedTemplate.template : t));
                    }
                    } catch (apiError) {
                        console.warn("Template updated locally but failed to sync with server", apiError);
    }           } else {
                // Existing template, update it
                console.log('Updating existing template');

                //update existing template in state
                setWorkoutTemplates(prev =>
                    prev.map(template => 
                        template._id === editingTemplate._id ? templateToUpdate : template
                    )
                );

                //try to update to backend
                try {
                    const response = await fetch(`${API_URL}/templates/${editingTemplate._id}`, {
                        method: "PUT",
                        headers: { 
                            "Content-Type": "application/json" 
                        },
                        body: JSON.stringify({
                            studentNumber,
                            templateToUpdate,
                    }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('API error response:', errorText);
                    throw new Error(`Failed to update template: ${response.status}`);
                }

                const updatedTemplate = await response.json();
                console.log('Template updated on backend:', updatedTemplate);

                //sync with backend response
                if(updatedTemplate.template) {
                    setCurrentTemplate(updatedTemplate.template);
                }
            }
            catch (apiError) {
                console.warn("Template updated locally but failed to sync with server", apiError);
            }
        } 
        setEditingTemplate(null); //exit editing mode

        alert('Template saved successfully.'); //user feedback
        console.log('Template update process completed');

    } catch (err) {

        console.error('Failed to update template:', err);
        setError(`Failed to update template: ${err.message}`);
        alert('Could not update template. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };

 

    const handleDeleteTemplate = async (templateId) => {
    console.log('🗑️ Starting handleDeleteTemplate');
    console.log('🔍 Template ID to delete:', templateId);
    
    if (!templateId) {
        console.error('❌ No template ID provided');
        alert('Cannot delete template: Invalid ID');
        return;
    }

    // Find the template to get its name for confirmation
    const templateToDelete = workoutTemplates.find(t => t._id === templateId);
    if (!templateToDelete) {
        console.error('❌ Template not found in local state');
        alert('Template not found');
        return;
    }

    // Ask for confirmation
    const confirmDelete = window.confirm(
        `Are you sure you want to delete the template "${templateToDelete.name}"?\n\nThis action cannot be undone.`
    );
    
    if (!confirmDelete) {
        console.log('❌ User cancelled deletion');
        return;
    }

    console.log('🗑️ User confirmed deletion of:', templateToDelete.name);
    setLoading(true);
    setError(null);

    try {
        // Optimistically remove from UI first (better user experience)
        const originalTemplates = workoutTemplates;
        setWorkoutTemplates(prev => prev.filter(template => template._id !== templateId));
        
        console.log('🔄 Optimistically removed template from UI');

        // Try to delete from backend
        try {
            const response = await fetch(`${API_URL}/templates/${templateId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentNumber: studentNumber
                })
            });

            console.log('📡 Delete request sent, status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Backend delete failed:', errorText);
                throw new Error(`Failed to delete template: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ Template deleted from backend:', result);
            
            // Show success message
            alert(`Template "${templateToDelete.name}" deleted successfully!`);

        } catch (backendError) {
            console.error('💥 Backend delete failed, reverting UI:', backendError);
            
            // Revert the optimistic update
            setWorkoutTemplates(originalTemplates);
            
            // Show error to user
            setError(`Failed to delete template: ${backendError.message}`);
            alert(`Failed to delete template "${templateToDelete.name}". Please try again.`);
            
            throw backendError;
        }

        // If we're currently editing/viewing the deleted template, go back to start
        if (currentTemplate && currentTemplate._id === templateId) {
            console.log('🔄 Deleted template was currently active, returning to start screen');
            setCurrentTemplate(null);
            setEditingTemplate(null);
            setView('start');
        }

        console.log('✅ handleDeleteTemplate completed successfully');

    } catch (err) {
        console.error('💥 Error in handleDeleteTemplate:', err);
        // Error handling already done in the backend try/catch
    } finally {
        setLoading(false);
    }
 };

    const handleSaveWorkoutSession = async () => { 
    console.log('💾 Starting handleSaveWorkoutSession');
    console.log('🏋️ Current template:', JSON.stringify(currentTemplate, null, 2));
    console.log('⏱️ Workout start time:', workoutStartTime);
    console.log('⏱️ Workout end time:', workoutEndTime);
    console.log('⏱️ Elapsed time:', elapsedTime);
    
    if (!currentTemplate) {
        console.error('❌ No current workout to save');
        alert('No workout session to save');
        return;
    }

    // Check if workout was actually started (has timer data)
    if (!workoutStartTime && elapsedTime === 0) {
        const shouldSave = window.confirm(
            'You haven\'t started the workout timer yet. Do you still want to save this session?'
        );
        if (!shouldSave) return;
    }

    setLoading(true);
    setError(null);

    try {
        // Calculate workout statistics
        const completedSets = currentTemplate.exercises.reduce((total, exercise) => {
            return total + exercise.sets.filter(set => set.completed).length;
        }, 0);

        const totalSets = currentTemplate.exercises.reduce((total, exercise) => {
            return total + exercise.sets.length;
        }, 0);

        const totalWeight = currentTemplate.exercises.reduce((total, exercise) => {
            return total + exercise.sets.reduce((exerciseTotal, set) => {
                if (set.completed && set.weight && set.reps) {
                    return exerciseTotal + (parseFloat(set.weight) * parseInt(set.reps));
                }
                return exerciseTotal;
            }, 0);
        }, 0);

        const totalReps = currentTemplate.exercises.reduce((total, exercise) => {
            return total + exercise.sets.reduce((exerciseTotal, set) => {
                if (set.completed && set.reps) {
                    return exerciseTotal + parseInt(set.reps);
                }
                return exerciseTotal;
            }, 0);
        }, 0);

        // Create workout session object
        const workoutSession = {
            _id: `session_${Date.now()}`,
            studentNumber: studentNumber,
            templateId: currentTemplate._id,
            templateName: currentTemplate.name,
            startTime: workoutStartTime || Date.now(),
            endTime: workoutEndTime || Date.now(),
            duration: elapsedTime || 0,
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
            exercises: currentTemplate.exercises.map(exercise => ({
                _id: exercise._id,
                name: exercise.name,
                type: exercise.type || 'strength',
                sets: exercise.sets.map(set => ({
                    _id: set._id,
                    weight: parseFloat(set.weight) || 0,
                    reps: parseInt(set.reps) || 0,
                    completed: set.completed || false,
                    restTime: set.restTime || 0 // If you add rest timers later
                }))
            })),
            stats: {
                totalExercises: currentTemplate.exercises.length,
                totalSets: totalSets,
                completedSets: completedSets,
                completionRate: totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0,
                totalWeight: Math.round(totalWeight * 100) / 100, // Round to 2 decimal places
                totalReps: totalReps,
                averageWeight: totalSets > 0 ? Math.round((totalWeight / totalSets) * 100) / 100 : 0
            },
            notes: '' // You could add a notes field later
        };

        console.log('💾 Workout session to save:', JSON.stringify(workoutSession, null, 2));

        // Try to save to backend
        try {
            const response = await fetch(`${API_URL}/workouts/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workoutSession)
            });

            console.log('📡 Save request sent, status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Backend save failed:', errorText);
                throw new Error(`Failed to save workout session: ${response.status} ${response.statusText}`);
            }

            const savedSession = await response.json();
            console.log('✅ Workout session saved to backend:', savedSession);

            // Show success message with stats
            const successMessage = `
            Workout session saved successfully! 📊

            📈 Session Stats:
            • Duration: ${formatTime(elapsedTime)}
            • Completed Sets: ${completedSets}/${totalSets} (${workoutSession.stats.completionRate}%)
            • Total Weight: ${totalWeight} kg
            • Total Reps: ${totalReps}
            `.trim();

            alert(successMessage);

            // Optionally update template with "previous" values for next workout
            await updateTemplatePreviousValues(workoutSession);

        } catch (backendError) {
            console.error('💥 Backend save failed:', backendError);
            
            // Save to localStorage as backup
            try {
                const existingSessions = JSON.parse(localStorage.getItem('workoutSessions') || '[]');
                existingSessions.push(workoutSession);
                localStorage.setItem('workoutSessions', JSON.stringify(existingSessions));
                
                console.log('💾 Workout saved to localStorage as backup');
                alert(`Workout saved locally! 📱\n\nCloud sync failed: ${backendError.message}\nYour workout is saved on this device.`);
            } catch (localError) {
                console.error('❌ Failed to save locally too:', localError);
                throw new Error('Failed to save workout session anywhere');
            }
        }

        console.log('✅ handleSaveWorkoutSession completed successfully');

    } catch (err) {
        console.error('💥 Error in handleSaveWorkoutSession:', err);
        setError(`Failed to save workout session: ${err.message}`);
        alert(`Failed to save workout session: ${err.message}`);
    } finally {
        setLoading(false);
    }
 };

 // Helper function to update template with "previous" values
const updateTemplatePreviousValues = async (workoutSession) => {
    try {
        console.log('🔄 Updating template with previous values');
        
        // Update the current template in memory with new "previous" values
        const updatedTemplate = {
            ...currentTemplate,
            exercises: currentTemplate.exercises.map(exercise => {
                const sessionExercise = workoutSession.exercises.find(se => se._id === exercise._id);
                if (!sessionExercise) return exercise;
                
                return {
                    ...exercise,
                    sets: exercise.sets.map(set => {
                        const sessionSet = sessionExercise.sets.find(ss => ss._id === set._id);
                        if (!sessionSet || !sessionSet.completed) return set;
                        
                        return {
                            ...set,
                            previous: `${sessionSet.weight} kg x ${sessionSet.reps}`
                        };
                    })
                };
            })
        };

        // Update in templates list
        setWorkoutTemplates(prev => 
            prev.map(template => 
                template._id === currentTemplate._id ? updatedTemplate : template
            )
        );

        setCurrentTemplate(updatedTemplate);
        
        console.log('✅ Template updated with previous values');
    } catch (err) {
        console.warn('⚠️ Failed to update previous values:', err);
    }
};

// Helper function to get workout history
const getWorkoutHistory = async () => {
    try {
        const response = await fetch(`${API_URL}/workout-sessions/${studentNumber}`);
        if (response.ok) {
            const data = await response.json();
            return data.sessions || [];
        }
    } catch (err) {
        console.warn('Failed to fetch workout history:', err);
    }
};



    const handleStartWorkout = (template = null) => {

       

    let workoutToStart;



    if (template) {

        // ✅ Use the selected template

        workoutToStart = JSON.parse(JSON.stringify(template));

    } else {

        // ✅ Ask user for workout name

        const workoutName = prompt("Enter a name for your workout:");

        if (!workoutName || workoutName.trim() === "") {

            alert("Workout name cannot be empty.");

            return;

        }



        workoutToStart = {

            _id: `workout_${Date.now()}`,

            name: workoutName.trim(),

            exercises: [],

        };

    }



    // Reset timer

    setWorkoutStartTime(null);

    setWorkoutEndTime(null);

    setElapsedTime(0);

    setTimerRunning(false);



    // Ensure exercises are well-formed

    const processedWorkout = {

        ...workoutToStart,

        exercises: workoutToStart.exercises.map(ex => ({ ...ex, sets: ex.sets || [] })),

    };



    setCurrentTemplate(processedWorkout);

    setEditingTemplate(null);

    setView("workout");

};



   



    const handleFinishWorkout = () => {

        if (!timerRunning) return;

        setWorkoutEndTime(Date.now());

        setTimerRunning(false);

        const totalSeconds = Math.floor((Date.now() - workoutStartTime) / 1000);

        setElapsedTime(totalSeconds);

        const totalWeightLifted = calculateTotalWeight(currentTemplate);

        alert(`Workout finished! Duration: ${formatTime(totalSeconds)}.\nTotal weight lifted: ${totalWeightLifted} kg`);

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

    function StartScreen() {

    return (

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

  }



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

                                    <button

                                        className="delete-exercise-button"

                                        onClick={() => handleDeleteExercise(exercise._id)}

                                        title="Delete exercise"

                              >

                                        🗑️

                                    </button>

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

                                            <button

                                                className={`set-number ${set.completed ? 'completed' : ''}`}

                                                onClick={() => handleSetComplete(exercise._id, set._id)}

                                            >

                                                {index + 1}

                                            </button>

                                            <span className="previous-value">{set.previous}</span>

                                            <input

                                                type="number"

                                                className="weight-input"

                                                value={set.weight}

                                                onChange={(e) =>

                                                    handleSetValueChange(exercise._id, set._id, 'weight', e.target.value)

                                                }

                                                placeholder="40"

                                            />

                                            <input

                                                type="number"

                                                className="reps-input"

                                                value={set.reps}

                                                onChange={(e) =>

                                                    handleSetValueChange(exercise._id, set._id, 'reps', e.target.value)

                                                }

                                                placeholder="12"

                                            />

                                        </div>

                                    ))}

                                    <button className="add-set-button" onClick={() => handleAddSet(exercise._id)}>+ Add Set</button>

                                </div>

                            </div>

                        ))}

                        <div className="add-exercise-section">

                            <button className="add-exercise-button" onClick={handleAddExercise}>+ Add Exercise</button>

                        </div>

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