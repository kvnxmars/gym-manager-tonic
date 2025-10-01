import React, { memo } from 'react';
import SetRow from './SetRow';

const ExerciseCard = memo(({ 
    exercise, 
    onSetComplete, 
    onValueChange, 
    onAddSet, 
    onDeleteExercise 
}) => {
    return (
        <div className="exercise-section">
            <div className="exercise-header">
                <h3 className="exercise-name">{exercise.name}</h3>
                <button
                    className="delete-exercise-button"
                    onClick={() => onDeleteExercise(exercise._id)}
                    title="Delete exercise"
                >
                    🗑️
                </button>
            </div>
            <div className="sets-container">
                <div className="sets-header">
                    <span className="set-label">Set</span>
                    <span className="previous-label">Previous</span>
                    <span className="kg-label">kg</span>
                    <span className="reps-label">Reps</span>
                </div>
                {exercise.sets?.map((set, index) => (
                    <SetRow
                        key={set._id}
                        set={set}
                        index={index}
                        exerciseId={exercise._id}
                        onSetComplete={onSetComplete}
                        onValueChange={onValueChange}
                    />
                ))}
                <button 
                    className="add-set-button" 
                    onClick={() => onAddSet(exercise._id)}
                >
                    + Add Set
                </button>
            </div>
        </div>
    );
});

ExerciseCard.displayName = 'ExerciseCard';

export default ExerciseCard;