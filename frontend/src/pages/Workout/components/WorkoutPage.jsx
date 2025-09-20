import React from 'react';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react';

export const WorkoutPage = ({
  currentWorkout,
  exercises,
  newExerciseName,
  setNewExerciseName,
  onBack,
  onFinish,
  onAddExercise,
  onRemoveExercise
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onAddExercise();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex flex-col p-4 text-white">
      {/* Header */}
      <div className="w-full max-w-md mx-auto flex justify-between items-center py-4">
        <button 
          onClick={onBack} 
          className="text-xl font-bold p-2 hover:text-purple-300 transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="text-lg font-semibold">
          {currentWorkout ? currentWorkout.name : 'Empty Workout'}
        </span>
        <button
          onClick={onFinish}
          className="text-green-400 font-semibold p-2 hover:text-green-300 transition-colors"
        >
          Finish
        </button>
      </div>

      {/* Add Exercise Section */}
      <div className="w-full max-w-md mx-auto bg-purple-900/50 backdrop-blur-sm rounded-2xl p-6 mb-4 shadow-xl">
        <h3 className="text-xl font-bold mb-4">Add Exercise</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Exercise name"
            value={newExerciseName}
            onChange={(e) => setNewExerciseName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-3 bg-gray-700/70 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={onAddExercise}
            disabled={!newExerciseName.trim()}
            className="p-3 bg-purple-700 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
            aria-label="Add exercise"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Exercises List */}
      <div className="w-full max-w-md mx-auto flex-1 overflow-y-auto">
        {exercises.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {exercises.map((exercise, index) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                index={index}
                onRemove={() => onRemoveExercise(exercise.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="text-center text-gray-400 py-8">
    <p>No exercises added yet.</p>
    <p className="text-sm mt-2">Add an exercise above to get started!</p>
  </div>
);

const ExerciseCard = ({ exercise, index, onRemove }) => (
  <div className="bg-purple-900/50 backdrop-blur-sm rounded-xl p-4 shadow-xl">
    <div className="flex justify-between items-center">
      <h4 className="text-lg font-semibold">{exercise.name}</h4>
      <button
        onClick={onRemove}
        className="p-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
        aria-label={`Remove ${exercise.name}`}
      >
        <Trash2 size={16} />
      </button>
    </div>
    <div className="mt-3 text-sm text-gray-400">
      {exercise.sets?.length || 0} sets completed
    </div>
    
    {/* Exercise type if available */}
    {exercise.type && (
      <div className="mt-2">
        <span className="text-xs text-purple-300 capitalize bg-purple-700/50 px-2 py-1 rounded">
          {exercise.type}
        </span>
      </div>
    )}
  </div>
);