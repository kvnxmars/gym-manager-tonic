import { memo } from 'react';
import ExerciseCard from './ExerciseCard';
import TimerControls from './TimerControls';

const WorkoutScreen = memo(({ 
    currentTemplate,
    editingTemplate,
    loading,
    error,
    timerState,
    onBack,
    onTimerStart,
    onTimerFinish,
    onSave,
    onUpdate,
    onSetComplete,
    onValueChange,
    onAddSet,
    onDeleteExercise,
    onAddExercise,
    formatTime,
    setError
}) => {
    return (
        <div className="workout-app">
            <div className="status-bar">
                <span className="device-name">Fit@NWU</span>
            </div>
            
            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}
            
            <div className="workout-header">
                <button className="back-button" onClick={onBack}>✕</button>
                
                <TimerControls
                    isRunning={timerState.isRunning}
                    hasEnded={timerState.hasEnded}
                    elapsedTime={timerState.elapsedTime}
                    onStart={onTimerStart}
                    onFinish={onTimerFinish}
                    formatTime={formatTime}
                />
                
                <h1 className="workout-title">
                    {currentTemplate ? currentTemplate.name : 'Empty Workout'}
                    {editingTemplate && <span className="editing-indicator"> (Editing)</span>}
                </h1>
                
                {editingTemplate ? (
                    <button 
                        className="save-button" 
                        onClick={onUpdate} 
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Template'}
                    </button>
                ) : (
                    <button 
                        className="save-button" 
                        onClick={onSave} 
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Workout'}
                    </button>
                )}
            </div>
            
            <div className="workout-content">
                {currentTemplate?.exercises?.length === 0 ? (
                    <div className="empty-workout">
                        <p>No exercises yet. Add some exercises to get started!</p>
                        <button className="primary-button" onClick={onAddExercise}>
                            Add Exercise
                        </button>
                    </div>
                ) : (
                    <>
                        {currentTemplate?.exercises?.map(exercise => (
                            <ExerciseCard
                                key={exercise._id}
                                exercise={exercise}
                                onSetComplete={onSetComplete}
                                onValueChange={onValueChange}
                                onAddSet={onAddSet}
                                onDeleteExercise={onDeleteExercise}
                            />
                        ))}
                        <div className="add-exercise-section">
                            <button className="add-exercise-button" onClick={onAddExercise}>
                                + Add Exercise
                            </button>
                        </div>
                    </>
                )}
            </div>
            
            <div className="bottom-nav">
                <button className="nav-item">👤</button>
                <button className="nav-item">📈</button>
                <button className="nav-item">📋</button>
                <button className="nav-item">⚙️</button>
            </div>
        </div>
    );
});

WorkoutScreen.displayName = 'WorkoutScreen';

export default WorkoutScreen;
