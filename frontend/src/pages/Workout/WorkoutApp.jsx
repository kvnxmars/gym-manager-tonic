import { useState, useEffect, useCallback } from 'react';
import { useWorkoutTimer } from './hooks/useWorkoutTimer';
import { workoutApi } from './services/workoutAPI';
import StartScreen from './components/StartScreen';
import WorkoutScreen from './components/WorkoutScreen';
import '../../styles/WorkoutApp.css';
//import WorkoutTemplate from '../../../../backend/models/WorkoutTemplate';
//import WorkoutSession from '../../../../backend/models/WorkoutSession';

/**
 * Main WorkoutApp Component - Refactored for Performance
 * 
 * Key improvements:
 * - Timer isolated in custom hook (no more per-second re-renders)
 * - Child components memoized
 * - Event handlers wrapped in useCallback
 * - API calls centralized
 * - Clean component separation
 */
const WorkoutApp = () => {
    // View state
    const [view, setView] = useState('start');
    
    // Loading and error state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Template state
    const [workoutTemplates, setWorkoutTemplates] = useState([]);
    const [currentTemplate, setCurrentTemplate] = useState(null);
    const [editingTemplate, setEditingTemplate] = useState(null);
    
    // Student data
    const [studentNumber, setStudentNumber] = useState(null);
    
    // Timer (isolated - doesn't cause parent re-renders)
    const { elapsedTime, isRunning, start, stop, reset, getStartTime } = useWorkoutTimer();
    const [workoutEndTime, setWorkoutEndTime] = useState(null);

    //for sessions
    const [sessionId, setSessionId] = useState(null);

    // Get student data from memory (changed from localStorage)
    useEffect(() => {
        // Try to get from memory first
        const storedStudent = localStorage?.getItem?.("student");
        if (storedStudent) {
            try {
                const student = JSON.parse(storedStudent);
                setStudentNumber(student.studentNumber);
            } catch (e) {
                console.error("Failed to parse student data", e);
                setStudentNumber("12345678"); // Fallback
            }
        } else {
            setStudentNumber("12345678"); // Default for testing
        }
    }, []);

    // Fetch templates when student number is available
    useEffect(() => {
        if (studentNumber) {
            fetchTemplates();
        }
    }, [studentNumber]);

    // Fetch templates from API
    const fetchTemplates = async () => {
        if (!studentNumber) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const templates = await workoutApi.fetchTemplates(studentNumber);
            setWorkoutTemplates(templates);
        } catch (err) {
            setError(err.message);
            console.error('Failed to fetch templates:', err);
        } finally {
            setLoading(false);
        }
    };

    // Format time helper
    const formatTime = useCallback((seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    }, []);

    // ==================== TEMPLATE HANDLERS ====================
    
    const handleAddTemplate = useCallback(async () => {
        const templateName = prompt("Enter a name for your new template:");
        if (!templateName || templateName.trim() === "") {
            alert("Template name cannot be empty.");
            return;
        }

        const newTemplate = {
            templateIdd: `template_${Date.now()}`,
            name: templateName.trim(),
            category: "Custom",
            exercises: [],
        };

        // Optimistically add to UI
        setWorkoutTemplates(prev => [...prev, newTemplate]);

        // Try to save to backend
        try {
            const result = await workoutApi.createTemplate(studentNumber, newTemplate);
            
            // Update with server response
            if (result.template) {
                setWorkoutTemplates(prev => 
                    prev.map(t => t._id === newTemplate._id ? result.template : t)
                );
                setCurrentTemplate(result.template);
            }
            
            // Open for editing
            setEditingTemplate(result.template || newTemplate);
            setView("workout");
        } catch (err) {
            console.warn("Template created locally but failed to sync:", err);
            // Keep the local version
            setCurrentTemplate(newTemplate);
            setEditingTemplate(newTemplate);
            setView("workout");
        }
    }, [studentNumber]);

    const handleUpdateTemplate = useCallback(async () => {
        if (!currentTemplate) {
            alert('No template to update.');
            return;
        }

        // Validate
        if (!currentTemplate.name || currentTemplate.name.trim() === '') {
            alert('Template name cannot be empty.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Clean up template data
            const cleanedTemplate = {
                ...currentTemplate,
                name: currentTemplate.name.trim(),
                exercises: currentTemplate.exercises
                    .filter(ex => ex.name && ex.name.trim() !== '')
                    .map(ex => ({
                        ...ex,
                        name: ex.name.trim(),
                        sets: ex.sets.map(set => ({
                            ...set,
                            weight: set.weight || '',
                            reps: set.reps || '',
                            completed: set.completed || false
                        }))
                    }))
            };

            // Determine if new or existing
            const isNew = !editingTemplate || editingTemplate._id?.startsWith('template_');

            let result;
            if (isNew) {
                result = await workoutApi.createTemplate(studentNumber, cleanedTemplate);
            } else {
                result = await workoutApi.updateTemplate(
                    studentNumber, 
                    editingTemplate._id, 
                    cleanedTemplate
                );
            }

            // Update local state
            if (result.template) {
                setWorkoutTemplates(prev => {
                    const exists = prev.find(t => t._id === result.template._id);
                    if (exists) {
                        return prev.map(t => t._id === result.template._id ? result.template : t);
                    }
                    return [...prev, result.template];
                });
                setCurrentTemplate(result.template);
            }

            setEditingTemplate(null);
            alert('Template saved successfully!');
        } catch (err) {
            console.error('Failed to update template:', err);
            setError(`Failed to update template: ${err.message}`);
            alert('Could not update template. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [currentTemplate, editingTemplate, studentNumber]);

    const handleDeleteTemplate = useCallback(async (templateId) => {
        if (!templateId) {
            alert('Cannot delete template: Invalid ID');
            return;
        }

        const templateToDelete = workoutTemplates.find(t => t._id === templateId);
        if (!templateToDelete) {
            alert('Template not found');
            return;
        }

        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${templateToDelete.name}"?\n\nThis action cannot be undone.`
        );

        if (!confirmDelete) return;

        setLoading(true);
        const originalTemplates = workoutTemplates;

        // Optimistically remove from UI
        setWorkoutTemplates(prev => prev.filter(t => t._id !== templateId));

        try {
            await workoutApi.deleteTemplate(studentNumber, templateId);
            alert(`Template "${templateToDelete.name}" deleted successfully!`);

            // If currently viewing/editing deleted template, go back
            if (currentTemplate && currentTemplate._id === templateId) {
                setCurrentTemplate(null);
                setEditingTemplate(null);
                setView('start');
            }
        } catch (err) {
            console.error('Failed to delete template:', err);
            // Revert optimistic update
            setWorkoutTemplates(originalTemplates);
            setError(`Failed to delete template: ${err.message}`);
            alert(`Failed to delete template. Please try again.`);
        } finally {
            setLoading(false);
        }
    }, [workoutTemplates, currentTemplate, studentNumber]);

    const handleTemplateEdit = useCallback((template) => {
        const templateToEdit = template
            ? JSON.parse(JSON.stringify(template))
            : { 
                _id: `template_${Date.now()}`, 
                name: 'New Template', 
                category: 'Custom',
                exercises: [] 
            };

        setCurrentTemplate(templateToEdit);
        setEditingTemplate(template);
        setView('workout');
    }, []);

    // ==================== WORKOUT HANDLERS ====================

    const handleStartWorkout = useCallback((template = null) => {
        let workoutToStart;

        // Generate a new, unique ID for this workout session
        const newSessionId = `session_${Date.now()}`;
    
        // **Crucial: Set the state variable here**
        setSessionId(newSessionId);

        if (template) {
            // Deep clone to avoid mutations
            workoutToStart = JSON.parse(JSON.stringify(template));
        } else {
            const workoutName = prompt("Enter a name for your workout:");
            if (!workoutName || workoutName.trim() === "") {
                alert("Workout name cannot be empty.");
                return;
            }

            workoutToStart = {
                //_id: newSessionId,
                name: workoutName.trim(),
                category: 'Custom',
                exercises: [],
            };
        }

        // Reset timer
        reset();
        setWorkoutEndTime(null);

        // Ensure exercises are well-formed
        const processedWorkout = {
            ...workoutToStart,
            exercises: workoutToStart.exercises.map(ex => ({
                ...ex,
                sets: ex.sets || []
            })),
        };

        setCurrentTemplate(processedWorkout);
        setEditingTemplate(null);
        setView("workout");
    }, [reset]);

    const handleTimerStart = useCallback(() => {
        start();
    }, [start]);

    const handleTimerFinish = useCallback(() => {
        if (!isRunning) return;
        
        stop();
        setWorkoutEndTime(Date.now());
        
        const totalWeight = currentTemplate?.exercises.reduce((total, ex) => {
            return total + ex.sets.reduce((setTotal, s) => {
                if (s.completed) {
                    return setTotal + (parseFloat(s.weight) || 0);
                }
                return setTotal;
            }, 0);
        }, 0) || 0;

        alert(
            `Workout finished!\nDuration: ${formatTime(elapsedTime)}\nTotal weight lifted: ${totalWeight} kg`
        );
    }, [isRunning, stop, elapsedTime, formatTime, currentTemplate]);

    const handleSaveWorkoutSession = useCallback(async () => {
        if (!currentTemplate) {
            alert('No workout session to save');
            return;
        }

        // Check if workout was actually started
        if (!getStartTime() && elapsedTime === 0) {
            const shouldSave = window.confirm(
                'You haven\'t started the workout timer yet. Do you still want to save this session?'
            );
            if (!shouldSave) return;
        }

        setLoading(true);
        setError(null);

        try {
            // Calculate statistics
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
                studentNumber: studentNumber,
                templateId: currentTemplate._id,
                templateName: currentTemplate.name,
                timing : {
                    startedAt: getStartTime() || Date.now(),
                    finishedAt: workoutEndTime || Date.now(),
                    duration: elapsedTime || 0,
                },
                
                //date: new Date().toISOString().split('T')[0],
                exercises: currentTemplate.exercises.map(exercise => ({
                    exerciseId: exercise._id,
                    exerciseName: exercise.name,
                    //type: exercise.type || 'strength',
                    sets: exercise.sets.map(set => ({
                        setId: set._id,
                        weight: parseFloat(set.weight) || 0,
                        reps: parseInt(set.reps) || 0,
                        completed: set.completed || false,
                        restTime: set.restTime || 0
                    }))
                })),
                summary: {
                    totalExercises: currentTemplate.exercises.length,
                    totalSets: totalSets,
                    completedSets: completedSets,
                    //totalVolume: totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0,
                    //totalWeight: Math.round(totalWeight * 100) / 100,
                    //totalReps: totalReps,
                    //averageWeight: totalSets > 0 ? Math.round((totalWeight / totalSets) * 100) / 100 : 0
                }
                //notes: ''
            };

            // Try to save to backend
            try {
                await workoutApi.saveWorkoutSession(workoutSession);

                const successMessage = `Workout session saved successfully!\n\nSession Stats:\n• Duration: ${formatTime(elapsedTime)}`;

                alert(successMessage);

                // Update template with previous values
                await updateTemplatePreviousValues(workoutSession);
            } catch (backendError) {
                console.error('Backend save failed:', backendError);
                
                // Save to memory as backup
                const existingSessions = JSON.parse(
                    window.sessionStorage?.getItem?.('workoutSessions') || '[]'
                );
                existingSessions.push(workoutSession);
                window.sessionStorage?.setItem?.(
                    'workoutSessions', 
                    JSON.stringify(existingSessions)
                );

                alert(`Workout saved locally!\n\nCloud sync failed: ${backendError.message}\nYour workout is saved on this device.`);
            }
        } catch (err) {
            console.error('Error in handleSaveWorkoutSession:', err);
            setError(`Failed to save workout session: ${err.message}`);
            alert(`Failed to save workout session: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [currentTemplate, studentNumber, elapsedTime, workoutEndTime, formatTime, getStartTime]);

    const updateTemplatePreviousValues = async (workoutSession) => {
        try {
            const updatedTemplate = {
                ...currentTemplate,
                exercises: currentTemplate.exercises.map(exercise => {
                    const sessionExercise = workoutSession.exercises.find(
                        se => se._id === exercise._id
                    );
                    if (!sessionExercise) return exercise;

                    return {
                        ...exercise,
                        sets: exercise.sets.map(set => {
                            const sessionSet = sessionExercise.sets.find(
                                ss => ss._id === set._id
                            );
                            if (!sessionSet || !sessionSet.completed) return set;

                            return {
                                ...set,
                                previous: `${sessionSet.weight} kg x ${sessionSet.reps}`
                            };
                        })
                    };
                })
            };

            setWorkoutTemplates(prev =>
                prev.map(template =>
                    template._id === currentTemplate._id ? updatedTemplate : template
                )
            );

            setCurrentTemplate(updatedTemplate);
        } catch (err) {
            console.warn('Failed to update previous values:', err);
        }
    };

    // ==================== EXERCISE/SET HANDLERS ====================

    const handleSetComplete = useCallback((exerciseId, setId) => {
        setCurrentTemplate(prev => {
            if (!prev) return prev;
            
            return {
                ...prev,
                exercises: prev.exercises.map(exercise =>
                    exercise._id === exerciseId
                        ? {
                            ...exercise,
                            sets: exercise.sets.map(set =>
                                set._id === setId 
                                    ? { ...set, completed: !set.completed } 
                                    : set
                            )
                        }
                        : exercise
                )
            };
        });
    }, []);

    const handleSetValueChange = useCallback((exerciseId, setId, field, value) => {
        setCurrentTemplate(prev => {
            if (!prev) return prev;
            
            return {
                ...prev,
                exercises: prev.exercises.map(exercise =>
                    exercise._id === exerciseId
                        ? {
                            ...exercise,
                            sets: exercise.sets.map(set =>
                                set._id === setId 
                                    ? { ...set, [field]: value } 
                                    : set
                            )
                        }
                        : exercise
                )
            };
        });
    }, []);

    const handleAddSet = useCallback((exerciseId) => {
        const newSet = {
            _id: `s${Date.now()}`,
            previous: '',
            weight: '',
            reps: '',
            completed: false
        };

        setCurrentTemplate(prev => {
            if (!prev) return prev;
            
            return {
                ...prev,
                exercises: prev.exercises.map(exercise =>
                    exercise._id === exerciseId
                        ? { ...exercise, sets: [...exercise.sets, newSet] }
                        : exercise
                )
            };
        });
    }, []);

    const handleAddExercise = useCallback(() => {
        const exerciseName = prompt("Enter exercise name:");
        if (!exerciseName || exerciseName.trim() === '') return;

        const newExercise = {
            _id: `ex${Date.now()}`,
            name: exerciseName.trim(),
            type: 'strength',
            sets: [{ 
                _id: `s${Date.now()}`, 
                previous: '', 
                weight: '', 
                reps: '', 
                completed: false 
            }]
        };

        setCurrentTemplate(prev => {
            if (!prev) return prev;
            
            return {
                ...prev,
                exercises: [...prev.exercises, newExercise]
            };
        });
    }, []);

    const handleDeleteExercise = useCallback((exerciseId) => {
        if (!window.confirm("Are you sure you want to delete this exercise?")) return;

        setCurrentTemplate(prev => {
            if (!prev) return prev;
            
            return {
                ...prev,
                exercises: prev.exercises.filter(ex => ex._id !== exerciseId)
            };
        });
    }, []);

    // ==================== RENDER ====================

    if (view === 'start') {
        return (
            <StartScreen
                studentNumber={studentNumber}
                workoutTemplates={workoutTemplates}
                loading={loading}
                error={error}
                onStartEmptyWorkout={() => handleStartWorkout(null)}
                onStartWorkout={handleStartWorkout}
                onAddTemplate={handleAddTemplate}
                onEditTemplate={handleTemplateEdit}
                onDeleteTemplate={handleDeleteTemplate}
                setError={setError}
            />
        );
    }

    return (
        <WorkoutScreen
            currentTemplate={currentTemplate}
            editingTemplate={editingTemplate}
            loading={loading}
            error={error}
            timerState={{
                elapsedTime,
                isRunning,
                hasEnded: workoutEndTime !== null
            }}
            onBack={() => setView('start')}
            onTimerStart={handleTimerStart}
            onTimerFinish={handleTimerFinish}
            onSave={handleSaveWorkoutSession}
            onUpdate={handleUpdateTemplate}
            onSetComplete={handleSetComplete}
            onValueChange={handleSetValueChange}
            onAddSet={handleAddSet}
            onDeleteExercise={handleDeleteExercise}
            onAddExercise={handleAddExercise}
            formatTime={formatTime}
            setError={setError}
        />
    );
};

export default WorkoutApp;