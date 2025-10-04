import { useState } from 'react';
import { User, Clock, Plus, Dumbbell } from 'lucide-react';

export default function ProfileApp() {
  const [activeTab, setActiveTab] = useState('profile');

  const studentData = {
    firstName: 'Student First',
    lastName: 'Last Name',
    studentNumber: '00000000',
    email: 'StudentName@gmail.com',
    checkIns: 0
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* Profile Card Container */}
      <div className="w-full max-w-sm">
        <div className="bg-gradient-to-b from-purple-900 to-purple-800 rounded-3xl p-4 shadow-2xl">
          {/* Inner Card */}
          <div className="bg-gradient-to-b from-gray-300 via-gray-300 to-gray-400 rounded-3xl p-6 space-y-3">
            {/* Name */}
            <div className="bg-white rounded-full py-8 px-6 text-center shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                {studentData.firstName}
                <br />
                + {studentData.lastName}
              </h2>
            </div>

            {/* Student Number */}
            <div className="bg-white rounded-full py-4 px-6 text-center shadow-md">
              <p className="text-gray-900 font-bold text-base">
                Student Number: {studentData.studentNumber}
              </p>
            </div>

            {/* Email */}
            <div className="bg-white rounded-full py-4 px-6 text-center shadow-md">
              <p className="text-gray-900 font-bold text-base">
                Email : {studentData.email}
              </p>
            </div>

            {/* Check-ins */}
            <div className="bg-white rounded-full py-4 px-6 text-center shadow-md">
              <p className="text-gray-900 font-bold text-base">
                CheckIns : {studentData.checkIns.toString().padStart(2, '0')}
              </p>
            </div>

            {/* Change Password Button */}
            <button className="w-full bg-white rounded-full py-4 px-6 text-center shadow-md hover:bg-gray-50 transition-colors active:scale-95">
              <p className="text-gray-900 font-bold text-base">
                Change Password
              </p>
            </button>

            {/* Eagle Logo */}
            <div className="flex flex-col items-center pt-8 pb-6">
              <div className="w-16 h-16 mb-2">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Eagle head shape */}
                  <ellipse cx="50" cy="45" rx="25" ry="30" fill="#7c3aed"/>
                  
                  {/* Beak */}
                  <path d="M 50 55 L 65 60 L 50 65 Z" fill="#fbbf24"/>
                  
                  {/* Eyes */}
                  <circle cx="40" cy="40" r="4" fill="white"/>
                  <circle cx="60" cy="40" r="4" fill="white"/>
                  <circle cx="40" cy="40" r="2" fill="black"/>
                  <circle cx="60" cy="40" r="2" fill="black"/>
                  
                  {/* Head feathers/crest */}
                  <path d="M 35 20 Q 40 15 45 20" stroke="#6d28d9" strokeWidth="3" fill="none"/>
                  <path d="M 45 18 Q 50 10 55 18" stroke="#6d28d9" strokeWidth="3" fill="none"/>
                  <path d="M 55 20 Q 60 15 65 20" stroke="#6d28d9" strokeWidth="3" fill="none"/>
                  
                  {/* Wing hints on sides */}
                  <path d="M 25 50 Q 15 55 20 65" stroke="#6d28d9" strokeWidth="3" fill="none"/>
                  <path d="M 75 50 Q 85 55 80 65" stroke="#6d28d9" strokeWidth="3" fill="none"/>
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-purple-700">NWU<span className="text-2xl align-super">®</span></h3>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex justify-around mt-4 px-2">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`p-4 rounded-full transition-all ${
                activeTab === 'profile' 
                  ? 'bg-gray-400 shadow-lg' 
                  : 'bg-gray-500 hover:bg-gray-400'
              }`}
            >
              <User className="w-7 h-7 text-gray-800" />
            </button>
            <button 
              onClick={() => setActiveTab('time')}
              className={`p-4 rounded-full transition-all ${
                activeTab === 'time' 
                  ? 'bg-gray-400 shadow-lg' 
                  : 'bg-gray-500 hover:bg-gray-400'
              }`}
            >
              <Clock className="w-7 h-7 text-gray-800" />
            </button>
            <button 
              onClick={() => setActiveTab('add')}
              className={`p-4 rounded-full transition-all ${
                activeTab === 'add' 
                  ? 'bg-gray-400 shadow-lg' 
                  : 'bg-gray-500 hover:bg-gray-400'
              }`}
            >
              <Plus className="w-7 h-7 text-gray-800" />
            </button>
            <button 
              onClick={() => setActiveTab('gym')}
              className={`p-4 rounded-full transition-all ${
                activeTab === 'gym' 
                  ? 'bg-gray-400 shadow-lg' 
                  : 'bg-gray-500 hover:bg-gray-400'
              }`}
            >
              <Dumbbell className="w-7 h-7 text-gray-800" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
