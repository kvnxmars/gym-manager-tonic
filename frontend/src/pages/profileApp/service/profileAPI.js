// API Service Layer
const apiService = {
  async fetchStudentProfile() {
    try {
      const response = await fetch(`${API_URL}/student/${studentNumber}`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      
      const data = await response.json();
      return data || [];


    } catch (error) {
      console.error('API Error:', error);
      // Fallback mock data for development
      return {
        name: "Student First + Last Name",
        studentNumber: "00000000",
        email: "StudentName@gmail.com",
        checkIns: 45
      };
    }
  },

  async fetchWorkoutStats() {
    try {
      const response = await fetch(`${API_URL}/student/stats/${studentNumber}`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      // Fallback mock data
      return {
        totalWorkouts: 45,
        weeklyAverage: 3.5,
        totalHours: 67.5,
        caloriesBurned: 28500
      };
    }
  },

  async fetchWorkoutSessions() {
    try {
      const response = await fetch(`${API_URL}/workouts/${studentNumber}`);
      if (!response.ok) throw new Error('Failed to fetch sessions');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      // Fallback mock data
      return [
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
    }
  },

  async updatePassword(newPassword) {
    try {
      const response = await fetch(`${API_URL}/student/password/${studentNumber}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      });
      if (!response.ok) throw new Error('Failed to update password');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};