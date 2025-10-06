import { useState, useEffect } from 'react';
import { Calendar, Clock, Flame, Dumbbell } from 'lucide-react';

  const API_URL = import.meta.env.VITE_API_URL;
const WorkoutsGrid = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async (studentNumber) => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        //fetch real workout data from the api
        const response = await fetch(`${API_URL}/workouts/${studentNumber}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch workouts');
        }

        const data = await response.json(); //parse response
        setWorkouts(data); //update state with fetched data
      }catch (error) {
        console.error('Error fetching workouts:', error);
        setWorkouts(mockData);
      }
      finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };

  const getTypeColor = (type) => {
    const colors = {
      "Body Building": "from-blue-500 to-blue-600",
      "Cardio": "from-orange-500 to-red-500",
      "Pilates": "from-purple-500 to-pink-500"
    };
    return colors[type] || "from-gray-500 to-gray-600";
  };

  const getTypeIcon = (type) => {
    if (type === "Body Building") return "💪";
    if (type === "Cardio") return "❤️";
    if (type === "Pilates") return "🤸‍♀️";
    return "🏃";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading workouts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Workout History</h1>
          <p className="text-gray-600">Your fitness journey at a glance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getTypeColor(workout.type)}`} />
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{getTypeIcon(workout.type)}</div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {workout.type}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar size={14} />
                        <span>{formatDate(workout.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={18} />
                      <span className="text-sm font-medium">Duration</span>
                    </div>
                    <span className="font-bold text-gray-800">{workout.duration} min</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Dumbbell size={18} />
                      <span className="text-sm font-medium">Exercises</span>
                    </div>
                    <span className="font-bold text-gray-800">{workout.exercises}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                    <div className="flex items-center gap-2 text-orange-600">
                      <Flame size={18} />
                      <span className="text-sm font-medium">Calories</span>
                    </div>
                    <span className="font-bold text-orange-600">{workout.calories} kcal</span>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {workouts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏋️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No workouts yet</h3>
            <p className="text-gray-500">Start your fitness journey today!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutsGrid;