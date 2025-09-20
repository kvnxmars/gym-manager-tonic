import React from 'react';
import { Trash2 } from 'lucide-react';

export const ExerciseList = ({ exercises, onRemove, onUpdate, showAddExercise }) => {
  const handleSetChange = (exerciseId, setIndex, field, value) => {
    const exercise = exercises.find(e => e.id === exerciseId);
    const newSets = exercise.sets.map((set, index) => {
      if (index === setIndex) {
        return { ...set, [field]: value };
      }
      return set;
    });
    onUpdate(exerciseId, { sets: newSets });
  };

  const handleAddSet = (exerciseId) => {
    const exercise = exercises.find(e => e.id === exerciseId);
    const newSets = [...exercise.sets, { reps: '', weight: '', time: '', distance: '', restTime: '' }];
    onUpdate(exerciseId, { sets: newSets });
  };

  const handleRemoveSet = (exerciseId, setIndex) => {
    const exercise = exercises.find(e => e.id === exerciseId);
    const newSets = exercise.sets.filter((_, index) => index !== setIndex);
    onUpdate(exerciseId, { sets: newSets });
  };

  if (exercises.length === 0 && !showAddExercise) {
    return <p className="text-gray-400 text-center py-4">No exercises added yet</p>;
  }

  return (
    <div className="space-y-3">
      {exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          onRemove={() => onRemove(exercise.id)}
          onSetChange={handleSetChange}
          onAddSet={handleAddSet}
          onRemoveSet={handleRemoveSet}
        />
      ))}
    </div>
  );
};

const ExerciseCard = ({ exercise, onRemove, onSetChange, onAddSet, onRemoveSet }) => {
  const renderSetInputs = (set, setIndex) => {
    switch (exercise.type) {
      case 'strength':
        return (
          <>
            <input
              type="number"
              placeholder="Reps"
              value={set.reps}
              onChange={(e) => onSetChange(exercise.id, setIndex, 'reps', e.target.value)}
              className="p-2 bg-gray-600/70 rounded text-white placeholder-gray-400"
            />
            <input
              type="number"
              placeholder="Weight"
              value={set.weight}
              onChange={(e) => onSetChange(exercise.id, setIndex, 'weight', e.target.value)}
              className="p-2 bg-gray-600/70 rounded text-white placeholder-gray-400"
            />
          </>
        );
      
      case 'cardio':
        return (
          <>
            <input
              type="number"
              placeholder="Time"
              value={set.time}
              onChange={(e) => onSetChange(exercise.id, setIndex, 'time', e.target.value)}
              className="p-2 bg-gray-600/70 rounded text-white placeholder-gray-400"
            />
            <input
              type="number"
              placeholder="Distance"
              value={set.distance}
              onChange={(e) => onSetChange(exercise.id, setIndex, 'distance', e.target.value)}
              className="p-2 bg-gray-600/70 rounded text-white placeholder-gray-400"
            />
          </>
        );
      
      case 'flexibility':
      case 'plyometric':
        return (
          <input
            type="number"
            placeholder="Time (sec)"
            value={set.time}
            onChange={(e) => onSetChange(exercise.id, setIndex, 'time', e.target.value)}
            className="p-2 bg-gray-600/70 rounded text-white placeholder-gray-400 col-span-2"
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-purple-800/50 rounded-xl p-4">
      {/* Exercise Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-lg">{exercise.name}</h4>
          <span className="text-xs text-purple-300 capitalize bg-purple-700/50 px-2 py-1 rounded">
            {exercise.type}
          </span>
        </div>
        <button
          onClick={onRemove}
          className="p-1 bg-red-600 hover:bg-red-500 rounded transition-colors"
          aria-label={`Remove ${exercise.name}`}
        >
          <Trash2 size={14} />
        </button>
      </div>
      
      {/* Sets */}
      <div className="space-y-2">
        {exercise.sets.map((set, setIndex) => (
          <div key={setIndex} className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Set {setIndex + 1}</span>
              {exercise.sets.length > 1 && (
                <button
                  onClick={() => onRemoveSet(exercise.id, setIndex)}
                  className="text-red-400 hover:text-red-300"
                  aria-label={`Remove set ${setIndex + 1}`}
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              {renderSetInputs(set, setIndex)}
              
              {/* Rest Time - Always shown */}
              <input
                type="number"
                placeholder="Rest"
                value={set.restTime}
                onChange={(e) => onSetChange(exercise.id, setIndex, 'restTime', e.target.value)}
                className="p-2 bg-gray-600/70 rounded text-white placeholder-gray-400 col-span-2"
              />
            </div>
          </div>
        ))}
        
        {/* Add Set Button */}
        <button
          onClick={() => onAddSet(exercise.id)}
          className="w-full p-2 bg-purple-700/30 hover:bg-purple-600/30 rounded-lg text-sm transition-colors"
        >
          + Add Set
        </button>
      </div>
    </div>
  );
};