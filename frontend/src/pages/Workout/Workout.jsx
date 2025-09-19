import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Save, Trash2, Edit, Play } from 'lucide-react';
import '../styles/Workout.css';

const Workout = () => {
  const [view, setView] = useState('start');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for managing workout templates
  const [workoutTemplates, setWorkoutTemplates] = useState([]);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [editingTemplate, setEditingTemplate] = useState(null);

  // State for template exercise editing
  const [templateExercises, setTemplateExercises] = useState([]);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    type: 'strength', // strength, cardio, flexibility, plyometric
    sets: [{ reps: '', weight: '', time: '', distance: '', restTime: '' }]
  });

  // State for the currently selected workout/exercise
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [workoutInProgress, setWorkoutInProgress] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [newExerciseName, setNewExerciseName] = useState('');

  // Mock API endpoint URL - replace with your actual backend URL
  const API_URL = "http://localhost:5000/api/templates";
  
  // Student number - you can replace this with actual user ID from auth context
  const studentNumber = "12345";

  // --- API Functions ---
  const fetchWorkoutTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${studentNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      const data = await response.json();
      setWorkoutTemplates(data.templates || []);
    } catch (err) {
      setError(err.message);
      console.error("Fetch templates error:", err);
      // Fallback to localStorage if API fails
      const saved = localStorage.getItem(`workout_templates_${studentNumber}`);
      if (saved) {
        setWorkoutTemplates(JSON.parse(saved));
        setError(null); // Clear error if fallback works
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTemplate = async () => {
    if (!newTemplateName.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: newTemplateName.trim(),
          studentNumber: studentNumber 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create template');
      }
      
      const data = await response.json();
      setWorkoutTemplates([...workoutTemplates, data.template]);
      setNewTemplateName('');
      setView('start');
    } catch (err) {
      setError(err.message);
      console.error("Add template error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm("Are you sure you want to delete this template?")) return;

    setLoading(true);
    try {
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
    } finally {
      setLoading(false);
    }
  };

  const handleEditTemplate = async () => {
    if (!editingTemplate || !editingTemplate.name.trim()) return;

    setLoading(true);
    try {
      const templateToSave = {
        ...editingTemplate,
        name: editingTemplate.name.trim(),
        exercises: templateExercises
      };

      const response = await fetch(`${API_URL}/${editingTemplate._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          name: templateToSave.name,
          exercises: templateToSave.exercises,
          studentNumber: studentNumber 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update template');
      }
      
      const data = await response.json();
      setWorkoutTemplates(workoutTemplates.map(t =>
        t._id === data.template._id ? data.template : t
      ));
      setEditingTemplate(null);
      setTemplateExercises([]);
      setView('start');
    } catch (err) {
      setError(err.message);
      console.error("Edit template error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Exercise management functions
  const handleAddExerciseToTemplate = () => {
    if (!newExercise.name.trim()) return;
    
    const exercise = {
      id: Date.now().toString(),
      ...newExercise,
      name: newExercise.name.trim()
    };
    
    setTemplateExercises([...templateExercises, exercise]);
    setNewExercise({
      name: '',
      type: 'strength',
      sets: [{ reps: '', weight: '', time: '', distance: '', restTime: '' }]
    });
    setShowAddExercise(false);
  };

  const handleRemoveExerciseFromTemplate = (exerciseId) => {
    setTemplateExercises(templateExercises.filter(e => e.id !== exerciseId));
  };

  const handleAddSetToExercise = (exerciseId) => {
    setTemplateExercises(templateExercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: [...exercise.sets, { reps: '', weight: '', time: '', distance: '', restTime: '' }]
        };
      }
      return exercise;
    }));
  };

  const handleRemoveSetFromExercise = (exerciseId, setIndex) => {
    setTemplateExercises(templateExercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.filter((_, index) => index !== setIndex)
        };
      }
      return exercise;
    }));
  };

  const handleSetChange = (exerciseId, setIndex, field, value) => {
    setTemplateExercises(templateExercises.map(exercise => {
      if (exercise.id === exerciseId) {
        const newSets = exercise.sets.map((set, index) => {
          if (index === setIndex) {
            return { ...set, [field]: value };
          }
          return set;
        });
        return { ...exercise, sets: newSets };
      }
      return exercise;
    }));
  };

  const handleNewExerciseSetChange = (setIndex, field, value) => {
    const newSets = newExercise.sets.map((set, index) => {
      if (index === setIndex) {
        return { ...set, [field]: value };
      }
      return set;
    });
    setNewExercise({ ...newExercise, sets: newSets });
  };

  const handleStartWorkout = (template = null) => {
    setCurrentWorkout(template);
    setWorkoutInProgress(true);
    setExercises(template ? [...template.exercises] : []);
    setView('workout');
  };

  const handleAddExercise = () => {
    if (!newExerciseName.trim()) return;
    
    const newExercise = {
      id: Date.now().toString(),
      name: newExerciseName.trim(),
      sets: []
    };
    
    setExercises([...exercises, newExercise]);
    setNewExerciseName('');
  };

  const handleRemoveExercise = (exerciseId) => {
    setExercises(exercises.filter(e => e.id !== exerciseId));
  };

  const handleFinishWorkout = () => {
    setWorkoutInProgress(false);
    setCurrentWorkout(null);
    setExercises([]);
    setView('start');
  };

  // Fetch templates on initial component load
  useEffect(() => {
    fetchWorkoutTemplates();
  }, []);

  // --- Component View ---

  const renderView = () => {
    switch (view) {
      case 'start':
        return <StartWorkoutPage
          workoutTemplates={workoutTemplates}
          loading={loading}
          error={error}
          setView={setView}
          handleStartWorkout={handleStartWorkout}
          handleDeleteTemplate={handleDeleteTemplate}
          setEditingTemplate={setEditingTemplate}
          setTemplateExercises={setTemplateExercises}
        />;
      case 'addTemplate':
        return <AddTemplatePage
          editingTemplate={editingTemplate}
          setEditingTemplate={setEditingTemplate}
          newTemplateName={newTemplateName}
          setNewTemplateName={setNewTemplateName}
          templateExercises={templateExercises}
          setTemplateExercises={setTemplateExercises}
          showAddExercise={showAddExercise}
          setShowAddExercise={setShowAddExercise}
          newExercise={newExercise}
          setNewExercise={setNewExercise}
          handleAddTemplate={handleAddTemplate}
          handleEditTemplate={handleEditTemplate}
          handleAddExerciseToTemplate={handleAddExerciseToTemplate}
          handleRemoveExerciseFromTemplate={handleRemoveExerciseFromTemplate}
          handleAddSetToExercise={handleAddSetToExercise}
          handleRemoveSetFromExercise={handleRemoveSetFromExercise}
          handleSetChange={handleSetChange}
          handleNewExerciseSetChange={handleNewExerciseSetChange}
          loading={loading}
          setView={setView}
        />;
      case 'workout':
        return <WorkoutPage
          currentWorkout={currentWorkout}
          exercises={exercises}
          newExerciseName={newExerciseName}
          setNewExerciseName={setNewExerciseName}
          handleAddExercise={handleAddExercise}
          handleRemoveExercise={handleRemoveExercise}
          handleFinishWorkout={handleFinishWorkout}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="App font-sans min-h-screen">
      {renderView()}
    </div>
  );
};

export default Workout;