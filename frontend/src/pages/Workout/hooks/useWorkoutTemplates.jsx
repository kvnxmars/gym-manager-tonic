import { useState, useCallback } from 'react';
import { workoutTemplateAPI } from '../services/workoutAPI';

export const useWorkoutTemplates = () => {
  const [workoutTemplates, setWorkoutTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Template form state
  const [newTemplateName, setNewTemplateName] = useState('');
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateExercises, setTemplateExercises] = useState([]);

  const fetchWorkoutTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const templates = await workoutTemplateAPI.fetchTemplates();
      setWorkoutTemplates(templates);
    } catch (err) {
      setError(err.message);
      console.error("Fetch templates error:", err);
      
      // Fallback to localStorage if API fails
      const saved = localStorage.getItem(`workout_templates_${workoutTemplateAPI.studentNumber}`);
      if (saved) {
        setWorkoutTemplates(JSON.parse(saved));
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddTemplate = useCallback(async () => {
    if (!newTemplateName.trim()) return false;

    setLoading(true);
    try {
      const newTemplate = await workoutTemplateAPI.createTemplate({
        name: newTemplateName.trim(),
        exercises: templateExercises
      });
      
      setWorkoutTemplates(prev => [...prev, newTemplate]);
      resetTemplateForm();
      return true;
    } catch (err) {
      setError(err.message);
      console.error("Add template error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [newTemplateName, templateExercises]);

  const handleEditTemplate = useCallback(async () => {
    if (!editingTemplate || !editingTemplate.name.trim()) return false;

    setLoading(true);
    try {
      const updatedTemplate = await workoutTemplateAPI.updateTemplate(
        editingTemplate._id,
        {
          name: editingTemplate.name.trim(),
          exercises: templateExercises
        }
      );
      
      setWorkoutTemplates(prev => 
        prev.map(t => t._id === updatedTemplate._id ? updatedTemplate : t)
      );
      resetTemplateForm();
      return true;
    } catch (err) {
      setError(err.message);
      console.error("Edit template error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [editingTemplate, templateExercises]);

  const handleDeleteTemplate = useCallback(async (templateId) => {
    if (!window.confirm("Are you sure you want to delete this template?")) return;

    setLoading(true);
    try {
      await workoutTemplateAPI.deleteTemplate(templateId);
      setWorkoutTemplates(prev => prev.filter(t => t._id !== templateId));
    } catch (err) {
      setError(err.message);
      console.error("Delete template error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetTemplateForm = useCallback(() => {
    setNewTemplateName('');
    setEditingTemplate(null);
    setTemplateExercises([]);
  }, []);

  return {
    // State
    workoutTemplates,
    loading,
    error,
    newTemplateName,
    editingTemplate,
    templateExercises,
    
    // Setters
    setNewTemplateName,
    setEditingTemplate,
    setTemplateExercises,
    
    // Actions
    fetchWorkoutTemplates,
    handleAddTemplate,
    handleEditTemplate,
    handleDeleteTemplate,
    resetTemplateForm
  };
};