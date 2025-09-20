import { useState, useCallback } from 'react';

export const useExerciseManagement = () => {
  // State for template exercise editing
  const [templateExercises, setTemplateExercises] = useState([]);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    type: 'strength',
    sets: [{ reps: '', weight: '', time: '', distance: '', restTime: '' }]
  });

  const handleAddExerciseToTemplate = useCallback(() => {
    if (!newExercise.name.trim()) return;
    
    const exercise = {
      id: Date.now().toString(),
      ...newExercise,
      name: newExercise.name.trim()
    };
    
    setTemplateExercises(prev => [...prev, exercise]);
    setNewExercise({
      name: '',
      type: 'strength',
      sets: [{ reps: '', weight: '', time: '', distance: '', restTime: '' }]
    });
    setShowAddExercise(false);
  }, [newExercise, templateExercises]);

  const handleRemoveExerciseFromTemplate = useCallback((exerciseId) => {
    setTemplateExercises(prev => prev.filter(e => e.id !== exerciseId));
  }, []);

  const handleAddSetToExercise = useCallback((exerciseId) => {
    setTemplateExercises(prev => prev.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: [...exercise.sets, { reps: '', weight: '', time: '', distance: '', restTime: '' }]
        };
      }
      return exercise;
    }));
  }, []);

  const handleRemoveSetFromExercise = useCallback((exerciseId, setIndex) => {
    setTemplateExercises(prev => prev.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.filter((_, index) => index !== setIndex)
        };
      }
      return exercise;
    }));
  }, []);

  const handleSetChange = useCallback((exerciseId, setIndex, field, value) => {
    setTemplateExercises(prev => prev.map(exercise => {
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
  }, []);

  const handleNewExerciseSetChange = useCallback((setIndex, field, value) => {
    const newSets = newExercise.sets.map((set, index) => {
      if (index === setIndex) {
        return { ...set, [field]: value };
      }
      return set;
    });
    setNewExercise({ ...newExercise, sets: newSets });
  }, [newExercise]);

  const handleAddSetToNewExercise = useCallback(() => {
    setNewExercise(prev => ({
      ...prev, 
      sets: [...prev.sets, { reps: '', weight: '', time: '', distance: '', restTime: '' }]
    }));
  }, []);

  const handleRemoveSetFromNewExercise = useCallback((setIndex) => {
    if (newExercise.sets.length <= 1) return;
    const newSets = newExercise.sets.filter((_, i) => i !== setIndex);
    setNewExercise({ ...newExercise, sets: newSets });
  }, [newExercise]);

  const resetExerciseForm = useCallback(() => {
    setTemplateExercises([]);
    setShowAddExercise(false);
    setNewExercise({
      name: '',
      type: 'strength',
      sets: [{ reps: '', weight: '', time: '', distance: '', restTime: '' }]
    });
  }, []);

  return {
    // State
    templateExercises,
    showAddExercise,
    newExercise,
    
    // Setters
    setTemplateExercises,
    setShowAddExercise,
    setNewExercise,
    
    // Actions
    handleAddExerciseToTemplate,
    handleRemoveExerciseFromTemplate,
    handleAddSetToExercise,
    handleRemoveSetFromExercise,
    handleSetChange,
    handleNewExerciseSetChange,
    handleAddSetToNewExercise,
    handleRemoveSetFromNewExercise,
    resetExerciseForm
  };
};