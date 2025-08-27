import React from 'react';

const Dashboard = ({ userProfile, onMoodChange, onMoodSubmit }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600 mb-6">
            How are you feeling today? Let's track your mood and productivity.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
              <h2 className="text-xl font-semibold mb-2">Today's Mood</h2>
              <p className="text-blue-100">
                {userProfile.moodText || "No mood recorded yet"}
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-6 text-white">
              <h2 className="text-xl font-semibold mb-2">Career Goals</h2>
              <p className="text-green-100">
                {userProfile.careerGoals.length} goals set
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
              Record Mood
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
              View Progress
            </button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
              Set Goals
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;