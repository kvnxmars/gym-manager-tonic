import React, { useState, useEffect } from 'react';
import { StartWorkoutPage } from './StartWorkout';
import { AddTemplatePage } from './AddTemplate';
import { WorkoutPage } from './WorkoutPage';
import { useWorkoutTemplates } from '../hooks/useWorkoutTemplates';
import { useWorkoutSession } from '../hooks/useWorkoutSession';
import { useExerciseManagement } from '../hooks/useExerciseManagement';
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

  // Exercise management for templates
  const {
    templateExercises,
    setTemplateExercises,
    showAddExercise,
    setShowAddExercise,
    newExercise,
    setNewExercise,
    handleAddExerciseToTemplate,
    handleRemoveExerciseFromTemplate,
    handleSetChange,
    handleNewExerciseSetChange,
    resetExerciseForm
  } = useExerciseManagement();

  // Fetch templates on component mount
  useEffect(() => {
    fetchWorkoutTemplates();
  }, [fetchWorkoutTemplates]);

  const handleNavigateToStart = () => {
    resetTemplateForm();
    resetExerciseForm();
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
      ? await handleEditTemplate(templateExercises) 
      : await handleAddTemplate(templateExercises);
    
    if (success) {
      resetExerciseForm();
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
            showAddExercise={showAddExercise}
            setShowAddExercise={setShowAddExercise}
            newExercise={newExercise}
            setNewExercise={setNewExercise}
            loading={loading}
            onBack={handleNavigateToStart}
            onSave={handleSaveTemplate}
            onAddExerciseToTemplate={handleAddExerciseToTemplate}
            onRemoveExerciseFromTemplate={handleRemoveExerciseFromTemplate}
            onSetChange={handleSetChange}
            onNewExerciseSetChange={handleNewExerciseSetChange}
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