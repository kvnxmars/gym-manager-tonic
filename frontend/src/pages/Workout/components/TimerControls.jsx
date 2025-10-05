import React, { memo } from 'react';

const TimerDisplay = memo(({ elapsedTime, formatTime }) => (
    <p className="elapsed-time">⏱ Time: {formatTime(elapsedTime)}</p>
));

TimerDisplay.displayName = 'TimerDisplay';

const TimerControls = memo(({ 
    isRunning, 
    hasEnded, 
    elapsedTime, 
    onStart, 
    onFinish,
    formatTime 
}) => {
    return (
        <div className="timer-controls">
            {!isRunning && !hasEnded && (
                <button className="primary-button" onClick={onStart}>
                    ▶️ Start Workout
                </button>
            )}
            {isRunning && (
                <button className="finish-button" onClick={onFinish}>
                    ⏹ Finish Workout
                </button>
            )}
            {(isRunning || hasEnded) && (
                <TimerDisplay elapsedTime={elapsedTime} formatTime={formatTime} />
            )}
        </div>
    );
});

TimerControls.displayName = 'TimerControls';

export default TimerControls;