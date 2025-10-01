import React, { memo } from 'react';

const TemplateCard = memo(({ 
    template, 
    onStart, 
    onEdit, 
    onDelete 
}) => (
    <div className="template-card-container">
        <button className="template-card" onClick={() => onStart(template)}>
            <span className="template-name">{template.name}</span>
            <span className="template-category">{template.category || 'Custom'}</span>
            <span className="exercise-count">
                {template.exercises?.length || 0} exercises
            </span>
        </button>
        <div className="template-actions">
            <button 
                onClick={() => onEdit(template)} 
                className="edit-button" 
                title="Edit template"
            >
                ✏️
            </button>
            <button 
                onClick={() => onDelete(template._id)} 
                className="delete-button" 
                title="Delete template"
            >
                🗑️
            </button>
        </div>
    </div>
));

TemplateCard.displayName = 'TemplateCard';

const StartScreen = memo(({ 
    studentNumber,
    workoutTemplates,
    loading,
    error,
    onStartEmptyWorkout,
    onStartWorkout,
    onAddTemplate,
    onEditTemplate,
    onDeleteTemplate,
    setError
}) => {
    return (
        <div className="workout-app">
            <div className="status-bar">
                <span className="device-name">Fit@NWU</span>
                {studentNumber && (
                    <span className="student-info">Student: {studentNumber}</span>
                )}
            </div>
            
            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}
            
            <div className="app-content">
                <div className="workout-section">
                    <h2 className="section-title">Start Workout</h2>
                    <button 
                        className="primary-button" 
                        onClick={onStartEmptyWorkout} 
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Start an Empty Workout'}
                    </button>
                </div>
                
                <div className="workout-section">
                    <div className="section-header">
                        <h2 className="section-title">Templates</h2>
                        <button 
                            className="add-button" 
                            onClick={onAddTemplate} 
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Add Template'}
                        </button>
                    </div>
                </div>
                
                <div className="templates-grid">
                    {loading && <p>Loading templates...</p>}
                    {!loading && workoutTemplates.length === 0 && (
                        <p>No templates found. Add one to get started!</p>
                    )}
                    {!loading && workoutTemplates.map(template => (
                        <TemplateCard
                            key={template._id}
                            template={template}
                            onStart={onStartWorkout}
                            onEdit={onEditTemplate}
                            onDelete={onDeleteTemplate}
                        />
                    ))}
                </div>
            </div>
            
            <div className="bottom-nav">
                <button className="nav-item active">👤</button>
                <button className="nav-item">📈</button>
                <button className="nav-item">📋</button>
                <button className="nav-item">⚙️</button>
            </div>
        </div>
    );
});

StartScreen.displayName = 'StartScreen';

export default StartScreen;