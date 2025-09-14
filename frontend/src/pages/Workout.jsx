import React, { useState } from 'react';

// Main application component
const Workout = () => {
  // State to manage the current view: 'start', 'select', 'workout', or 'addTemplate'
  const [view, setView] = useState('start');
  
  // State to hold the current workout data. This is a mock data structure.
  const [currentWorkout, setCurrentWorkout] = useState({
    name: 'Full Body III',
    exercises: [
      {
        id: 'iso-lateral-row',
        name: 'Iso-Lateral Row (Machine)',
        sets: [
          { id: 1, previous: '40 kg x 5 (W)', kg: 40, reps: 6 },
          { id: 2, previous: '70 kg x 12', kg: 70, reps: 12 },
          { id: 3, previous: '70 kg x 8', kg: 70, reps: 8 },
        ],
      },
      {
        id: 'lying-leg-curl',
        name: 'Lying Leg Curl (Machine)',
        sets: [
          { id: 1, previous: '40 kg x 5 (W)', kg: 40, reps: 6 },
          { id: 2, previous: '70 kg x 12', kg: 70, reps: 12 },
        ],
      },
    ],
  });

  const [selectedExercise, setSelectedExercise] = useState(null);

  // Component for the navigation bar at the bottom
  const NavigationBar = () => (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900 border-t border-purple-800 flex justify-around text-white">
      <div className="flex flex-col items-center">
        <span className="text-xl">🏃‍♂️</span>
        <span className="text-xs">Workout</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xl">⏱️</span>
        <span className="text-xs">Timer</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xl">➕</span>
        <span className="text-xs">Add</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xl">📈</span>
        <span className="text-xs">History</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xl">🏋️‍♂️</span>
        <span className="text-xs">Templates</span>
      </div>
    </div>
  );

  // Component for the Start Workout Page (replicates iPhone 16 Pro Max - 3)
  const StartWorkoutPage = () => (
    <div className="h-screen flex flex-col items-center justify-start p-4 bg-gradient-to-br from-purple-950 to-purple-800 text-white">
      <div className="w-full max-w-sm rounded-lg shadow-lg overflow-hidden my-4 bg-purple-900 p-4">
        <h2 className="text-lg font-bold mb-2">Start Workout</h2>
        <button
          onClick={() => setView('select')}
          className="w-full p-3 bg-purple-700 hover:bg-purple-600 rounded-lg text-lg font-semibold"
        >
          Start an Empty Workout
        </button>
      </div>

      <div className="w-full max-w-sm rounded-lg shadow-lg overflow-hidden my-4 bg-purple-900 p-4">
        <h2 className="text-lg font-bold mb-2">Templates</h2>
        <button
          onClick={() => setView('addTemplate')}
          className="w-full p-3 bg-purple-700 hover:bg-purple-600 rounded-lg text-lg font-semibold"
        >
          Add Template
        </button>
      </div>

      <div className="w-full max-w-sm mt-4">
        <h2 className="text-lg font-bold mb-2">Upper-Lower</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-800 p-6 rounded-lg text-lg text-center">Full Body III</div>
          <div className="bg-purple-800 p-6 rounded-lg text-lg text-center">Full Body II</div>
          <div className="bg-purple-800 p-6 rounded-lg text-lg text-center">Full Body I</div>
          <div className="bg-purple-800 p-6 rounded-lg text-lg text-center">...</div>
        </div>
      </div>
      <NavigationBar />
    </div>
  );

  // Component for the Select Workout Page (replicates iPhone 16 Pro Max - 5)
  const SelectWorkoutPage = () => (
    <div className="h-screen flex flex-col items-center justify-start p-4 bg-gradient-to-br from-purple-950 to-purple-800 text-white">
      <div className="w-full max-w-sm flex justify-between items-center my-4 text-purple-200">
        <button onClick={() => setView('start')} className="text-2xl font-bold">X</button>
        <span className="text-lg font-semibold">Start as Empty Workout</span>
        <button className="text-purple-400 font-semibold">Edit</button>
      </div>

      <div className="w-full max-w-sm flex-grow rounded-lg shadow-lg overflow-y-auto my-4 p-4 bg-purple-900 space-y-4">
        {currentWorkout.exercises.map((exercise, index) => (
          <div
            key={exercise.id}
            onClick={() => {
              setSelectedExercise(exercise);
              setView('workout');
            }}
            className="flex items-center space-x-4 p-4 bg-purple-800 rounded-lg shadow-md cursor-pointer hover:bg-purple-700 transition-colors"
          >
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-xl">🏋️</span>
            </div>
            <div className="flex-grow">
              <p className="font-semibold">{index + 1} x {exercise.name}</p>
              <p className="text-sm text-gray-400">{exercise.sets.length} sets</p>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full max-w-sm mt-auto mb-16 p-4">
        <button
          onClick={() => {
            setSelectedExercise(currentWorkout.exercises[0]);
            setView('workout');
          }}
          className="w-full p-3 bg-purple-700 hover:bg-purple-600 rounded-lg text-lg font-semibold"
        >
          Start Workout
        </button>
      </div>
      <NavigationBar />
    </div>
  );

  // Component for the Workout Page (replicates iPhone 16 Pro Max - 4)
  const WorkoutPage = () => {
    if (!selectedExercise) {
      return <div>No exercise selected.</div>;
    }

    const handleAddSet = () => {
      const newSet = {
        id: selectedExercise.sets.length + 1,
        previous: '-',
        kg: 0,
        reps: 0,
      };
      setSelectedExercise({
        ...selectedExercise,
        sets: [...selectedExercise.sets, newSet],
      });
    };

    const handleInputChange = (e, setId, field) => {
      const updatedSets = selectedExercise.sets.map((set) => {
        if (set.id === setId) {
          return { ...set, [field]: parseFloat(e.target.value) || 0 };
        }
        return set;
      });
      setSelectedExercise({
        ...selectedExercise,
        sets: updatedSets,
      });
    };

    return (
      <div className="h-screen flex flex-col items-center justify-start p-4 bg-gradient-to-br from-purple-950 to-purple-800 text-white">
        <div className="w-full max-w-sm flex justify-between items-center my-4 text-purple-200">
          <button onClick={() => setView('select')} className="text-2xl font-bold">X</button>
          <span className="text-lg font-semibold">Full Body III</span>
          <button className="text-purple-400 font-semibold">Save</button>
        </div>

        <div className="w-full max-w-sm flex-grow rounded-lg shadow-lg overflow-y-auto p-4 bg-purple-900">
          <h3 className="text-md text-gray-400 font-semibold mb-2">...</h3>
          <h2 className="text-xl font-bold mb-4">{selectedExercise.name}</h2>

          <div className="flex justify-between items-center bg-gray-800 p-2 rounded-lg mb-2 text-sm text-gray-300">
            <span className="w-1/4">Set</span>
            <span className="w-1/4">Previous</span>
            <span className="w-1/4">kg</span>
            <span className="w-1/4">Reps</span>
          </div>
          {selectedExercise.sets.map((set, index) => (
            <div key={set.id} className="flex justify-between items-center mb-2">
              <span className="w-1/4 flex items-center">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-center text-sm mr-2">{index + 1}</span>
              </span>
              <span className="w-1/4">{set.previous}</span>
              <input
                type="number"
                value={set.kg}
                onChange={(e) => handleInputChange(e, set.id, 'kg')}
                className="w-1/4 bg-gray-700 rounded-lg p-2 text-center"
              />
              <input
                type="number"
                value={set.reps}
                onChange={(e) => handleInputChange(e, set.id, 'reps')}
                className="w-1/4 bg-gray-700 rounded-lg p-2 text-center"
              />
            </div>
          ))}
          <button
            onClick={handleAddSet}
            className="w-full p-3 mt-4 bg-purple-700 hover:bg-purple-600 rounded-lg text-lg font-semibold"
          >
            + Add Set
          </button>
        </div>
        <NavigationBar />
      </div>
    );
  };

  // New component for the Add Template page
  const AddTemplatePage = () => (
    <div className="h-screen flex flex-col items-center justify-start p-4 bg-gradient-to-br from-purple-950 to-purple-800 text-white">
      <div className="w-full max-w-sm flex justify-start items-center my-4 text-purple-200">
        <button onClick={() => setView('start')} className="text-2xl font-bold">X</button>
        <span className="text-lg font-semibold ml-4">Add Template</span>
      </div>

      <div className="w-full max-w-sm flex-grow rounded-lg shadow-lg overflow-y-auto my-4 p-4 bg-purple-900 space-y-4">
        {/* Placeholder for template creation content */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-gray-400">Template Name</label>
          <input
            type="text"
            placeholder="e.g., Full Body III"
            className="w-full p-3 bg-gray-700 rounded-lg text-white"
          />
        </div>
        <button className="w-full p-3 bg-purple-700 hover:bg-purple-600 rounded-lg text-lg font-semibold">
          Add Exercise
        </button>
        {/* Placeholder list for exercises in the new template */}
      </div>

      <div className="w-full max-w-sm mt-auto mb-16 p-4">
        <button className="w-full p-3 bg-purple-700 hover:bg-purple-600 rounded-lg text-lg font-semibold">
          Save Template
        </button>
      </div>
      <NavigationBar />
    </div>
  );

  // Render the appropriate page based on the 'view' state
  const renderView = () => {
    switch (view) {
      case 'start':
        return <StartWorkoutPage />;
      case 'select':
        return <SelectWorkoutPage />;
      case 'workout':
        return <WorkoutPage />;
      case 'addTemplate':
        return <AddTemplatePage />;
      default:
        return <StartWorkoutPage />;
    }
  };

  return (
    <div className="App font-sans min-h-screen">
      {renderView()}
    </div>
  );
};

export default Workout;