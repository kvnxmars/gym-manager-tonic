import { useState } from 'react';
import { User, Calendar, TrendingUp, Dumbbell, Clock, Flame } from 'lucide-react';



// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-xl p-4 shadow-md">
    <div className="flex items-center space-x-3">
      <div className={`${color} p-3 rounded-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

// Workout Session Component
const WorkoutSession = ({ session }) => (
  <div className="bg-white rounded-xl p-4 shadow-md mb-3 hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h3 className="font-bold text-gray-800 text-lg">{session.type}</h3>
        <p className="text-gray-500 text-sm flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          {session.date}
        </p>
      </div>
      <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
        {session.duration} min
      </div>
    </div>
    <div className="grid grid-cols-3 gap-2">
      <div className="bg-gray-50 rounded-lg p-2 text-center">
        <p className="text-xs text-gray-500">Exercises</p>
        <p className="text-lg font-bold text-gray-800">{session.exercises}</p>
      </div>
      <div className="bg-gray-50 rounded-lg p-2 text-center">
        <p className="text-xs text-gray-500">Sets</p>
        <p className="text-lg font-bold text-gray-800">{session.sets}</p>
      </div>
      <div className="bg-gray-50 rounded-lg p-2 text-center">
        <p className="text-xs text-gray-500">Calories</p>
        <p className="text-lg font-bold text-gray-800">{session.calories}</p>
      </div>
    </div>
  </div>
);

// Main App Component
export default function NWUGymTracker() {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Student data
  const student = {
    name: "Student First + Last Name",
    studentNumber: "00000000",
    email: "StudentName@gmail.com",
    checkIns: 45
  };
  
  // Workout stats
  const stats = {
    totalWorkouts: 45,
    weeklyAverage: 3.5,
    totalHours: 67.5,
    caloriesBurned: 28500
  };
  
  // Past workout sessions
  const workoutSessions = [
    {
      id: 1,
      type: "Upper Body Strength",
      date: "Oct 3, 2025",
      duration: 65,
      exercises: 8,
      sets: 24,
      calories: 420
    },
    {
      id: 2,
      type: "Cardio & Core",
      date: "Oct 1, 2025",
      duration: 45,
      exercises: 6,
      sets: 18,
      calories: 380
    },
    {
      id: 3,
      type: "Leg Day",
      date: "Sep 29, 2025",
      duration: 75,
      exercises: 7,
      sets: 28,
      calories: 510
    },
    {
      id: 4,
      type: "Full Body",
      date: "Sep 27, 2025",
      duration: 60,
      exercises: 10,
      sets: 30,
      calories: 450
    },
    {
      id: 5,
      type: "HIIT Training",
      date: "Sep 25, 2025",
      duration: 30,
      exercises: 5,
      sets: 15,
      calories: 320
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <div className="max-w-md mx-auto bg-purple-900 min-h-screen">
        {/* Header */}
        <div className="bg-purple-800 px-6 py-4">
          <h1 className="text-white text-xl font-bold">Student Profile Page</h1>
        </div>

        {/* Content Area */}
        <div className="px-4 py-6 space-y-6">
          {/* Profile Section */}
          {activeTab === 'profile' && (
            <>
              <ProfileHeader student={student} />
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <StatsCard 
                  icon={Dumbbell}
                  label="Workouts"
                  value={stats.totalWorkouts}
                  color="bg-purple-500"
                />
                <StatsCard 
                  icon={TrendingUp}
                  label="Weekly Avg"
                  value={stats.weeklyAverage}
                  color="bg-blue-500"
                />
                <StatsCard 
                  icon={Clock}
                  label="Total Hours"
                  value={stats.totalHours}
                  color="bg-green-500"
                />
                <StatsCard 
                  icon={Flame}
                  label="Calories"
                  value={`${(stats.caloriesBurned / 1000).toFixed(1)}k`}
                  color="bg-orange-500"
                />
              </div>

              {/* Recent Workouts */}
              <div>
                <h2 className="text-white text-lg font-bold mb-3">Recent Workouts</h2>
                {workoutSessions.map(session => (
                  <WorkoutSession key={session.id} session={session} />
                ))}
              </div>

              {/* NWU Logo */}
              <div className="flex flex-col items-center py-6">
                <div className="w-20 h-20 bg-purple-600 rounded-2xl flex items-center justify-center mb-2">
                  <div className="text-white text-4xl font-bold">N</div>
                </div>
                <h2 className="text-purple-700 text-2xl font-bold">NWU®</h2>
              </div>

              {/* Change Password Button */}
              <button className="w-full bg-purple-200 text-purple-800 font-semibold py-4 rounded-xl hover:bg-purple-300 transition-colors">
                Change Password
              </button>
            </>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-purple-800 rounded-t-3xl px-6 py-4 flex justify-around">
          <button className="p-3 bg-purple-700 rounded-full hover:bg-purple-600 transition-colors">
            <User className="w-6 h-6 text-white" />
          </button>
          <button className="p-3 bg-purple-700 rounded-full hover:bg-purple-600 transition-colors">
            <Calendar className="w-6 h-6 text-white" />
          </button>
          <button className="p-3 bg-purple-700 rounded-full hover:bg-purple-600 transition-colors">
            <Dumbbell className="w-6 h-6 text-white" />
          </button>
          <button className="p-3 bg-purple-700 rounded-full hover:bg-purple-600 transition-colors">
            <TrendingUp className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}