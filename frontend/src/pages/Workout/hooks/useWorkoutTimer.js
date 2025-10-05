import { useState, useEffect, useRef } from 'react';

export const useWorkoutTimer = () => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const startTimeRef = useRef(null);
    const intervalRef = useRef(null);

    //reset timer
    const reset = () => {
        clearInterval(intervalRef.current);
        setElapsedTime (0);
    }
    
    //stop timer
    const stop = () => {
        setIsRunning(false);
    }


    useEffect(() => {
        if (isRunning && !intervalRef.current) {
            startTimeRef.current = Date.now() - (elapsedTime + 1000);

            intervalRef.current = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
            }, 1000);
        } else if (!isRunning && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isRunning]);


    const start = () => {
        if (!startTimeRef.current) {
            startTimeRef.current = Date.now();
        }
        setIsRunning(true);
    };

    const getStartTime = () => startTimeRef.current;

    return { elapsedTime, isRunning, start, stop, reset ,getStartTime };
};