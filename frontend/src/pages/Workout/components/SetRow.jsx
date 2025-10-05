import React, { memo } from 'react';

const SetRow = memo(({ 
    set, 
    index, 
    exerciseId, 
    onSetComplete, 
    onValueChange 
}) => {
    return (
        <div className="set-row">
            <button
                className={`set-number ${set.completed ? 'completed' : ''}`}
                onClick={() => onSetComplete(exerciseId, set._id)}
            >
                {index + 1}
            </button>
            <span className="previous-value">{set.previous || '-'}</span>
            <input
                type="number"
                className="weight-input"
                value={set.weight}
                onChange={(e) => onValueChange(exerciseId, set._id, 'weight', e.target.value)}
                placeholder="40"
            />
            <input
                type="number"
                className="reps-input"
                value={set.reps}
                onChange={(e) => onValueChange(exerciseId, set._id, 'reps', e.target.value)}
                placeholder="12"
            />
        </div>
    );
});

SetRow.displayName = 'SetRow';

export default SetRow;