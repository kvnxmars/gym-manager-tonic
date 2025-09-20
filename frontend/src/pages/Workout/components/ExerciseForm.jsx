import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

export const ExerciseForm = ({ onAdd, onCancel }) => {
  const [exercise, setExercise] = useState({
    name: '',
    type: 'strength',
    sets: [{ reps: '', weight: '', time: '', distance: '', restTime: '' }]
  });

  const handleSetChange = (setIndex, field, value) => {
    const newSets = exercise.sets.map((set, index) => {
      if (index === setIndex) {
        return { ...set, [field]: value };
      }
      return set;
    });
    setExercise({ ...exercise, sets: newSets });
  };

  const handleAddSet = () => {
    setExercise({
      ...exercise, 
      sets: [...exercise.sets, { reps: '', weight: '', time: '', distance: '', restTime: '' }]
    });
  };

  const handleRemoveSet = (setIndex) => {
    if (exercise.sets.length <= 1) return; // Keep at least one set
    const newSets = exercise.sets.filter((_, i) => i !== setIndex);
    setExercise({ ...exercise, sets: newSets });
  };

  const handleSubmit = () => {
    if (!exercise.name.trim()) return;
    onAdd(exercise);
    // Reset form after adding
    setExercise({
      name: '',
      type: 'strength',
      sets: [{ reps: '', weight: '', time: '', distance: '', restTime: '' }]
    });
  };

  const renderSetInputs = (set, index) => {
    const commonClasses = "p-2 bg-gray-600/70 rounded text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500";
    
    switch (exercise.type) {
      case 'strength':
        return (
          <>
            <input
              type="number"
              placeholder="Reps"
              value={set.reps}
              onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
              className={commonClasses}
              min="0"
            />
            <input
              type="number"
              placeholder="Weight (lbs)"
              value={set.weight}
              onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
              className={commonClasses}
              min="0"
              step="0.5"
            />
          </>
        );
      
      case 'cardio':
        return (
          <>
            <input
              type="number"
              placeholder="Time (min)"
              value={set.time}
              onChange={(e) => handleSetChange(index, 'time', e.target.value)}
              className={commonClasses}
              min="0"
              step="0.1"
            />
            <input
              type="number"
              placeholder="Distance (miles)"
              value={set.distance}
              onChange={(e) => handleSetChange(index, 'distance', e.target.value)}
              className={commonClasses}
              min="0"
              step="0.1"
            />
          </>
        );
      
      case 'flexibility':
      case 'plyometric':
        return (
          <input
            type="number"
            placeholder="Time (seconds)"
            value={set.time}
            onChange={(e) => handleSetChange(index, 'time', e.target.value)}
            className={`${commonClasses} col-span-2`}
            min="0"
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-purple-800/50 rounded-xl p-4 mb-4 space-y-4 animate-fadeIn">
      {/* Exercise Name Input */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Exercise Name</label>
        <input
          type="text"
          placeholder="e.g., Bench Press, Running, Push-ups"
          value={exercise.name}
          onChange={(e) => setExercise({...exercise, name: e.target.value})}
          className="w-full p-3 bg-gray-700/70 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          autoFocus
        />
      </div>
      
      {/* Exercise Type Selection */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Exercise Type</label>
        <select
          value={exercise.type}
          onChange={(e) => setExercise({...exercise, type: e.target.value})}
          className="w-full p-3 bg-gray-700/70 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer transition-all"
        >
          <option value="strength">💪 Strength Training</option>
          <option value="cardio">🏃 Cardio</option>
          <option value="flexibility">🧘 Flexibility</option>
          <option value="plyometric">⚡ Plyometric</option>
        </select>
      </div>

      {/* Sets Configuration */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm text-gray-400">Sets Configuration</label>
          <span className="text-xs text-purple-300">
            {exercise.sets.length} set{exercise.sets.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        {exercise.sets.map((set, index) => (
          <div key={index} className="bg-gray-700/50 rounded-lg p-3 space-y-3 transition-all hover:bg-gray-700/60">
            {/* Set Header */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-purple-200">
                Set {index + 1}
              </span>
              {exercise.sets.length > 1 && (
                <button
                  onClick={() => handleRemoveSet(index)}
                  className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-400/10 transition-all"
                  aria-label={`Remove set ${index + 1}`}
                  title="Remove this set"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            
            {/* Set Input Fields */}
            <div className="grid grid-cols-2 gap-3">
              {renderSetInputs(set, index)}
              
              {/* Rest Time - Always shown for all exercise types */}
              <div className="col-span-2">
                <input
                  type="number"
                  placeholder="Rest time (seconds)"
                  value={set.restTime}
                  onChange={(e) => handleSetChange(index, 'restTime', e.target.value)}
                  className="w-full p-2 bg-gray-600/70 rounded text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min="0"
                />
              </div>
            </div>
          </div>
        ))}
        
        {/* Add Set Button */}
        <button
          onClick={handleAddSet}
          className="w-full p-3 bg-purple-700/50 hover:bg-purple-600/50 rounded-lg text-sm transition-all duration-200 border border-purple-600/30 hover:border-purple-500/50"
        >
          ➕ Add Another Set
        </button>
      </div>

      {/* Form Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 p-3 bg-gray-600/70 hover:bg-gray-500/70 rounded-lg text-sm transition-all duration-200 font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!exercise.name.trim()}
          className="flex-1 p-3 bg-purple-700 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 rounded-lg text-sm transition-all duration-200 font-medium"
        >
          {exercise.name.trim() ? '✅ Add Exercise' : 'Enter Exercise Name'}
        </button>
      </div>
    </div>
  );
};