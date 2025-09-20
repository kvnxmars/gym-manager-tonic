import React, { useState } from 'react';
import { ChevronLeft, Save, Plus } from 'lucide-react';
import { ExerciseList } from './ExerciseList';
import { ExerciseForm } from './ExerciseForm';

export const AddTemplatePage = ({
  editingTemplate,
  newTemplateName,
  setNewTemplateName,
  setEditingTemplate,
  templateExercises,
  setTemplateExercises,
  loading,
  onBack,
  onSave
}) => {
  const [showAddExercise, setShowAddExercise] = useState(false);

  const handleNameChange = (value) => {
    if (editingTemplate) {
      setEditingTemplate({ ...editingTemplate, name: value });
    } else {
      setNewTemplateName(value);
    }
  };

  const handleAddExercise = (exercise) => {
    const newExercise = {
      id: Date.now().toString(),
      ...exercise,
      name: exercise.name.trim()
    };
    
    setTemplateExercises([...templateExercises, newExercise]);
    setShowAddExercise(false);
  };

  const handleRemoveExercise = (exerciseId) => {
    setTemplateExercises(templateExercises.filter(e => e.id !== exerciseId));
  };

  const handleUpdateExercise = (exerciseId, updatedExercise) => {
    setTemplateExercises(templateExercises.map(exercise =>
      exercise.id === exerciseId ? { ...exercise, ...updatedExercise } : exercise
    ));
  };

  const isFormValid = editingTemplate 
    ? editingTemplate.name.trim() 
    : newTemplateName.trim();

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
          {editingTemplate ? 'Edit Template' : 'Add Template'}
        </span>
        <button
          onClick={onSave}
          className="text-purple-400 font-semibold p-2 hover:text-purple-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isFormValid || loading}
          aria-label="Save template"
        >
          <Save size={20} />
        </button>
      </div>

      {/* Template Name Input */}
      <div className="w-full max-w-md mx-auto bg-purple-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-gray-400">Template Name</label>
          <input
            type="text"
            placeholder="e.g., Full Body III"
            value={editingTemplate ? editingTemplate.name : newTemplateName}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full p-3 bg-gray-700/70 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            autoFocus
          />
        </div>
      </div>

      {/* Exercise Management - Only show when editing */}
      {editingTemplate && (
        <div className="w-full max-w-md mx-auto flex-1 overflow-y-auto mb-4">
          <div className="bg-purple-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Exercises</h3>
              <button
                onClick={() => setShowAddExercise(!showAddExercise)}
                className="p-2 bg-purple-700 hover:bg-purple-600 rounded-lg transition-colors"
                aria-label="Add exercise"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Add Exercise Form */}
            {showAddExercise && (
              <ExerciseForm
                onAdd={handleAddExercise}
                onCancel={() => setShowAddExercise(false)}
              />
            )}

            {/* Exercise List */}
            <ExerciseList
              exercises={templateExercises}
              onRemove={handleRemoveExercise}
              onUpdate={handleUpdateExercise}
              showAddExercise={showAddExercise}
            />
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="w-full max-w-md mx-auto mt-auto mb-6">
        <button
          onClick={onSave}
          disabled={!isFormValid || loading}
          className="w-full p-4 bg-purple-700 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl text-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading && (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          )}
          {editingTemplate ? 'Save Changes' : 'Save Template'}
        </button>
      </div>
    </div>
  );
};