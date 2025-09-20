import { useState, useCallback } from 'react';

export const useWorkoutSession = () => {
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [workoutInProgress, setWorkoutInProgress] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [newExerciseName, setNewExerciseName] = useState('');

  const handleStartWorkout = useCallback((template = null) => {
    setCurrentWorkout(template);
    setWorkoutInProgress(true);
    setExercises(template ? [...(template.exercises || [])] : []);
  }, []);

  const handleAddExercise = useCallback(() => {
    if (!newExerciseName.trim()) return;
    
    const newExercise = {
      id: Date.now().toString(),
      name: newExerciseName.trim(),
      type: 'strength',
      sets: []
    };
    
    setExercises(prev => [...prev, newExercise]);
    setNewExerciseName('');
  }, [newExerciseName]);

  const handleRemoveExercise = useCallback((exerciseId) => {
    setExercises(prev => prev.filter(e => e.id !== exerciseId));
  }, []);

  const handleFinishWorkout = useCallback(() => {
    setWorkoutInProgress(false);
    setCurrentWorkout(null);
    setExercises([]);
    setNewExerciseName('');
  }, []);

  const handleAddSetToExercise = useCallback((exerciseId) => {
    setExercises(prev => prev.map(exercise => {
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
    setExercises(prev => prev.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: exercise.sets.filter((_, index) => index !== setIndex)
        };
      }
      return exercise;
    }));
  }, []);

  const handleUpdateSet = useCallback((exerciseId, setIndex, field, value) => {
    setExercises(prev => prev.map(exercise => {
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

  return {
    // State
    currentWorkout,
    workoutInProgress,
    exercises,
    newExerciseName,
    
    // Setters
    setNewExerciseName,
    
    // Actions
    handleStartWorkout,
    handleAddExercise,
    handleRemoveExercise,
    handleFinishWorkout,
    handleAddSetToExercise,
    handleRemoveSetFromExercise,
    handleUpdateSet
  };
};