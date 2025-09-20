import React from 'react';
import { Play, Plus, Edit, Trash2 } from 'lucide-react';

export const StartWorkoutPage = ({
  workoutTemplates,
  loading,
  error,
  onStartEmptyWorkout,
  onStartTemplateWorkout,
  onAddTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onRetryFetch
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex flex-col items-center justify-start p-4 text-white">
      {/* Start Empty Workout Card */}
      <div className="w-full max-w-md bg-purple-900/50 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Start Workout</h2>
        <button
          onClick={onStartEmptyWorkout}
          className="w-full p-4 bg-purple-700 hover:bg-purple-600 rounded-xl text-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Play size={20} />
          Start an Empty Workout
        </button>
      </div>

      {/* Templates Section */}
      <div className="w-full max-w-md bg-purple-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Templates</h2>
          <button
            onClick={onAddTemplate}
            className="p-2 bg-purple-700 hover:bg-purple-600 rounded-lg transition-colors"
            aria-label="Add new template"
          >
            <Plus size={20} />
          </button>
        </div>
        
        {/* Loading State */}
        {loading && (
          <p className="text-gray-400 text-center py-8">Loading templates...</p>
        )}
        
        {/* Error State */}
        {error && (
          <div className="text-red-400 text-center py-4">
            <p>{error}</p>
            <button 
              onClick={onRetryFetch}
              className="text-sm text-purple-400 underline hover:text-purple-300 mt-2"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Empty State */}
        {workoutTemplates.length === 0 && !loading && !error && (
          <p className="text-gray-400 text-center py-8">
            No templates found.{' '}
            <button 
              onClick={onAddTemplate} 
              className="text-purple-400 underline hover:text-purple-300"
            >
              Add one
            </button>
            !
          </p>
        )}
        
        {/* Templates List */}
        <div className="grid grid-cols-1 gap-3 mt-4">
          {workoutTemplates.map(template => (
            <TemplateCard
              key={template._id}
              template={template}
              onStart={() => onStartTemplateWorkout(template)}
              onEdit={() => onEditTemplate(template)}
              onDelete={() => onDeleteTemplate(template._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const TemplateCard = ({ template, onStart, onEdit, onDelete }) => {
  return (
    <div
      className="bg-purple-800/70 p-4 rounded-xl text-center text-lg font-semibold hover:bg-purple-700/70 transition-all duration-200 cursor-pointer relative group"
      onClick={onStart}
    >
      {/* Edit Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="absolute top-2 right-12 p-2 rounded-full bg-purple-600 hover:bg-purple-500 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Edit template"
      >
        <Edit size={16} className="text-white" />
      </button>
      
      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-2 right-2 p-2 rounded-full bg-red-600 hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Delete template"
      >
        <Trash2 size={16} className="text-white" />
      </button>
      
      {/* Template Content */}
      <div className="pr-16">{template.name}</div>
      <div className="text-sm text-gray-300 mt-1">
        {template.exercises?.length || 0} exercises
      </div>
    </div>
  );
};