import React, { useState, useEffect } from 'react';
import { StartWorkoutPage } from './StartWorkout';
import { AddTemplatePage } from './AddTemplate';
import { WorkoutPage } from './WorkoutPage';
import { useWorkoutTemplates } from '../hooks/useWorkoutTemplates';
import { useWorkoutSession } from '../hooks/useWorkoutSession';
import '../../../styles/Workout.css';

const Workout = () => {
  const [view, setView] = useState('start');
  
  // Template management
  const {
    workoutTemplates,
    loading,
    error,
    newTemplateName,
    setNewTemplateName,
    editingTemplate,
    setEditingTemplate,
    templateExercises,
    setTemplateExercises,
    fetchWorkoutTemplates,
    handleAddTemplate,
    handleDeleteTemplate,
    handleEditTemplate,
    resetTemplateForm
  } = useWorkoutTemplates();

  // Workout session management
  const {
    currentWorkout, 
    workoutInProgress,
    exercises,
    newExerciseName,
    setNewExerciseName,
    handleStartWorkout,
    handleAddExercise,
    handleRemoveExercise,
    handleFinishWorkout
  } = useWorkoutSession();

  // Fetch templates on component mount
  useEffect(() => {
    fetchWorkoutTemplates();
  }, [fetchWorkoutTemplates]);

  const handleNavigateToStart = () => {
    resetTemplateForm();
    setView('start');
  };

  const handleNavigateToAddTemplate = (template = null) => {
    if (template) {
      setEditingTemplate({...template});
      setTemplateExercises(template.exercises || []);
    }
    setView('addTemplate');
  };

  const handleNavigateToWorkout = (template = null) => {
    handleStartWorkout(template);
    setView('workout');
  };

  const handleSaveTemplate = async () => {
    const success = editingTemplate 
      ? await handleEditTemplate() 
      : await handleAddTemplate();
    
    if (success) {
      setView('start');
    }
  };

  const renderView = () => {
    switch (view) {
      case 'start':
        return (
          <StartWorkoutPage
            workoutTemplates={workoutTemplates}
            loading={loading}
            error={error}
            onStartEmptyWorkout={() => handleNavigateToWorkout()}
            onStartTemplateWorkout={handleNavigateToWorkout}
            onAddTemplate={() => handleNavigateToAddTemplate()}
            onEditTemplate={handleNavigateToAddTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            onRetryFetch={fetchWorkoutTemplates}
          />
        );
      
      case 'addTemplate':
        return (
          <AddTemplatePage
            editingTemplate={editingTemplate}
            newTemplateName={newTemplateName}
            setNewTemplateName={setNewTemplateName}
            setEditingTemplate={setEditingTemplate}
            templateExercises={templateExercises}
            setTemplateExercises={setTemplateExercises}
            loading={loading}
            onBack={handleNavigateToStart}
            onSave={handleSaveTemplate}
          />
        );
      
      case 'workout':
        return (
          <WorkoutPage
            currentWorkout={currentWorkout}
            exercises={exercises}
            newExerciseName={newExerciseName}
            setNewExerciseName={setNewExerciseName}
            onBack={() => {
              if (window.confirm("Are you sure you want to exit this workout?")) {
                handleFinishWorkout();
                setView('start');
              }
            }}
            onFinish={() => {
              handleFinishWorkout();
              setView('start');
            }}
            onAddExercise={handleAddExercise}
            onRemoveExercise={handleRemoveExercise}
          />
        );
      
      default:
        return (
          <StartWorkoutPage
            workoutTemplates={workoutTemplates}
            loading={loading}
            error={error}
            onStartEmptyWorkout={() => handleNavigateToWorkout()}
            onStartTemplateWorkout={handleNavigateToWorkout}
            onAddTemplate={() => handleNavigateToAddTemplate()}
            onEditTemplate={handleNavigateToAddTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            onRetryFetch={fetchWorkoutTemplates}
          />
        );
    }
  };

  return (
    <div className="App font-sans">
      {renderView()}
    </div>
  );
};

export default Workout;