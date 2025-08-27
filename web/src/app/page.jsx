import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Heart,
  Smile,
  Meh,
  Frown,
  Angry,
  Sparkles,
  Coffee,
  Music,
  BookOpen,
  Camera,
  Brain,
  Zap,
  Moon,
  Sun,
} from "lucide-react";
import Dashboard from "../components/Dashboard";

export default function MoodStreamApp() {
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [userProfile, setUserProfile] = useState({
    age: 25,
    careerGoals: [],
    mood: null,
    moodText: "",
    hasCompletedOnboarding: false,
  });

  // Check if user has completed onboarding
  useEffect(() => {
    const savedProfile = localStorage.getItem("moodstream_profile");
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
      if (profile.hasCompletedOnboarding) {
        setOnboardingStep(3); // Skip to main app
      }
    }
  }, []);

  const careerGoals = [
    {
      category: "Technology",
      subdivisions: [
        "DevOps",
        "Data Structures & Algorithms",
        "AI/ML",
        "Cybersecurity",
        "Frontend Development",
        "Backend Development",
        "Cloud Computing",
        "Mobile Development",
      ],
    },
    {
      category: "Business",
      subdivisions: [
        "Marketing",
        "Entrepreneurship",
        "Finance",
        "Sales",
        "Product Management",
        "Consulting",
        "Strategy",
      ],
    },
    {
      category: "Arts & Media",
      subdivisions: [
        "Music",
        "Film",
        "Photography",
        "Graphic Design",
        "Writing",
        "Animation",
        "Game Design",
      ],
    },
    {
      category: "Science & Academia",
      subdivisions: [
        "Physics",
        "Biology",
        "Psychology",
        "Research",
        "Chemistry",
        "Mathematics",
        "Environmental Science",
      ],
    },
    {
      category: "Health & Wellness",
      subdivisions: [
        "Medicine",
        "Mental Health",
        "Fitness",
        "Nutrition",
        "Physical Therapy",
        "Wellness Coaching",
      ],
    },
    {
      category: "Lifestyle",
      subdivisions: [
        "Travel",
        "Food & Cooking",
        "Self-Development",
        "Sports",
        "Fashion",
        "Home Design",
      ],
    },
  ];

  const moods = [
    { emoji: "😊", label: "Happy", value: "happy", color: "#FFD700" },
    { emoji: "😴", label: "Calm", value: "calm", color: "#87CEEB" },
    { emoji: "🤔", label: "Thoughtful", value: "thoughtful", color: "#DDA0DD" },
    { emoji: "💪", label: "Motivated", value: "motivated", color: "#FF6347" },
    { emoji: "😰", label: "Stressed", value: "stressed", color: "#FFA500" },
    { emoji: "😢", label: "Sad", value: "sad", color: "#4682B4" },
    { emoji: "🔥", label: "Energetic", value: "energetic", color: "#FF4500" },
    { emoji: "🌙", label: "Reflective", value: "reflective", color: "#708090" },
    { emoji: "❤️", label: "Loving", value: "loving", color: "#DC143C" },
    { emoji: "😤", label: "Frustrated", value: "frustrated", color: "#B22222" },
    { emoji: "✨", label: "Inspired", value: "inspired", color: "#FFD700" },
    { emoji: "☕", label: "Focused", value: "focused", color: "#8B4513" },
  ];

  const handleCareerGoalToggle = (category, subdivision) => {
    const goalId = `${category}:${subdivision}`;
    setUserProfile((prev) => ({
      ...prev,
      careerGoals: prev.careerGoals.includes(goalId)
        ? prev.careerGoals.filter((goal) => goal !== goalId)
        : [...prev.careerGoals, goalId],
    }));
  };

  const handleMoodSelect = (mood) => {
    setUserProfile((prev) => ({ ...prev, mood }));
  };

  const handleMoodUpdate = (newMood) => {
    const updatedProfile = { ...userProfile, mood: newMood };
    setUserProfile(updatedProfile);
    localStorage.setItem("moodstream_profile", JSON.stringify(updatedProfile));
  };

  const completeOnboarding = () => {
    const updatedProfile = { ...userProfile, hasCompletedOnboarding: true };
    setUserProfile(updatedProfile);
    localStorage.setItem("moodstream_profile", JSON.stringify(updatedProfile));
    setOnboardingStep(3);
  };

  const nextStep = () => {
    if (onboardingStep === 2 && userProfile.mood) {
      completeOnboarding();
    } else {
      setOnboardingStep((prev) => prev + 1);
    }
  };

  // Onboarding Screen 1: Welcome
  if (onboardingStep === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-md w-full text-center">
          <div className="mb-8 sm:mb-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl mx-auto mb-4 sm:mb-6 flex items-center justify-center shadow-lg overflow-hidden">
              <img
                src="https://ucarecdn.com/6e8230db-3884-4a59-a355-3b71be8104f3/-/format/auto/"
                alt="MoodStream Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#13343B] mb-3 sm:mb-4">
              MoodStream
            </h1>
            <p className="text-lg sm:text-xl text-gray-600">
              Your AI Mood Companion
            </p>
          </div>

          <p className="text-gray-500 mb-8 sm:mb-10 leading-relaxed text-sm sm:text-base px-2">
            Discover personalized content that matches your mood, interests, and
            goals. No signup required – let's get started!
          </p>

          <button
            onClick={nextStep}
            className="w-full bg-gradient-to-r from-[#13343B] to-[#FF4500] text-white py-4 sm:py-5 px-6 sm:px-8 rounded-2xl font-semibold text-base sm:text-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200 flex items-center justify-center touch-manipulation"
          >
            Get Started
            <ChevronRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Onboarding Screen 2: Age & Career Goals
  if (onboardingStep === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8 text-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#13343B] rounded-full mx-auto mb-3 sm:mb-4"></div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#13343B] mb-2">
              Tell us about yourself
            </h2>
            <p className="text-gray-600 text-sm sm:text-base px-4">
              This helps us curate the perfect content for you
            </p>
          </div>

          {/* Age Selection */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#13343B] mb-4">
              What's your age?
            </h3>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="16"
                max="70"
                value={userProfile.age}
                onChange={(e) =>
                  setUserProfile((prev) => ({
                    ...prev,
                    age: parseInt(e.target.value),
                  }))
                }
                className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer touch-manipulation"
                style={{
                  background: `linear-gradient(to right, #FF4500 0%, #FF4500 ${((userProfile.age - 16) / 54) * 100}%, #e5e7eb ${((userProfile.age - 16) / 54) * 100}%, #e5e7eb 100%)`,
                }}
              />
              <span className="text-xl sm:text-2xl font-bold text-[#FF4500] min-w-[3rem] text-center">
                {userProfile.age}
              </span>
            </div>
          </div>

          {/* Career Goals */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#13343B] mb-4">
              What are your career interests?{" "}
              <span className="text-sm text-gray-500 block sm:inline">
                (Select multiple)
              </span>
            </h3>
            <div className="space-y-4">
              {careerGoals.map((category) => (
                <div
                  key={category.category}
                  className="border border-gray-100 rounded-xl p-3 sm:p-4"
                >
                  <h4 className="font-semibold text-[#13343B] mb-3 text-sm sm:text-base">
                    {category.category}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {category.subdivisions.map((subdivision) => {
                      const goalId = `${category.category}:${subdivision}`;
                      const isSelected =
                        userProfile.careerGoals.includes(goalId);
                      return (
                        <button
                          key={subdivision}
                          onClick={() =>
                            handleCareerGoalToggle(
                              category.category,
                              subdivision,
                            )
                          }
                          className={`text-xs sm:text-sm px-3 py-2.5 rounded-lg border transition-all duration-200 active:scale-95 touch-manipulation ${
                            isSelected
                              ? "bg-[#FF4500] text-white border-[#FF4500] shadow-md"
                              : "bg-white text-gray-700 border-gray-200 hover:border-[#FF4500] hover:text-[#FF4500]"
                          }`}
                        >
                          {subdivision}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 space-y-4 sm:space-y-0">
            <button
              onClick={() => setOnboardingStep(0)}
              className="px-6 py-3 text-gray-600 hover:text-[#13343B] transition-colors touch-manipulation order-2 sm:order-1"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              disabled={userProfile.careerGoals.length === 0}
              className="w-full sm:w-auto bg-gradient-to-r from-[#13343B] to-[#FF4500] text-white py-3 px-6 sm:px-8 rounded-2xl font-semibold hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center touch-manipulation order-1 sm:order-2"
            >
              Continue
              <ChevronRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Onboarding Screen 3: Mood Selection
  if (onboardingStep === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 sm:mb-8 text-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#13343B] rounded-full mx-auto mb-3 sm:mb-4"></div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#13343B] mb-2">
              How are you feeling right now?
            </h2>
            <p className="text-gray-600 text-sm sm:text-base px-4">
              We'll curate content to match your current mood
            </p>
          </div>

          {/* Mood Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => handleMoodSelect(mood)}
                className={`p-4 sm:p-6 rounded-2xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation ${
                  userProfile.mood?.value === mood.value
                    ? "border-[#FF4500] bg-[#FF4500]/10 shadow-lg"
                    : "border-gray-200 hover:border-[#FF4500]/50 bg-white"
                }`}
              >
                <div className="text-3xl sm:text-4xl mb-2">{mood.emoji}</div>
                <div className="text-xs sm:text-sm font-medium text-gray-700">
                  {mood.label}
                </div>
              </button>
            ))}
          </div>

          {/* Optional mood text */}
          <div className="mb-6 sm:mb-8">
            <textarea
              placeholder="Tell us more about your mood (optional)"
              value={userProfile.moodText}
              onChange={(e) =>
                setUserProfile((prev) => ({
                  ...prev,
                  moodText: e.target.value,
                }))
              }
              className="w-full p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-transparent text-sm sm:text-base"
              rows={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <button
              onClick={() => setOnboardingStep(1)}
              className="px-6 py-3 text-gray-600 hover:text-[#13343B] transition-colors touch-manipulation order-2 sm:order-1"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              disabled={!userProfile.mood}
              className="w-full sm:w-auto bg-gradient-to-r from-[#13343B] to-[#FF4500] text-white py-3 px-6 sm:px-8 rounded-2xl font-semibold hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center touch-manipulation order-1 sm:order-2"
            >
              Start My Journey
              <Sparkles className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main App - Use Dashboard component
  if (onboardingStep === 3) {
    return (
      <Dashboard userProfile={userProfile} onUpdateMood={handleMoodUpdate} />
    );
  }

  // Placeholder for now
  return (
    <div className="min-h-screen bg-white">
      <div className="p-8 text-center">
        <h1 className="text-4xl font-bold text-[#13343B] mb-4">
          Welcome to MoodStream!
        </h1>
        <p className="text-gray-600 mb-8">
          Your personalized feed is being prepared...
        </p>

        <div className="max-w-md mx-auto bg-gray-100 rounded-2xl p-6">
          <h3 className="font-semibold text-[#13343B] mb-4">Your Profile:</h3>
          <div className="text-left space-y-2 text-sm">
            <p>
              <strong>Age:</strong> {userProfile.age}
            </p>
            <p>
              <strong>Career Goals:</strong> {userProfile.careerGoals.length}{" "}
              selected
            </p>
            <p>
              <strong>Current Mood:</strong> {userProfile.mood?.emoji}{" "}
              {userProfile.mood?.label}
            </p>
            {userProfile.moodText && (
              <p>
                <strong>Mood Note:</strong> "{userProfile.moodText}"
              </p>
            )}
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("moodstream_profile");
              setUserProfile({
                age: 25,
                careerGoals: [],
                mood: null,
                moodText: "",
                hasCompletedOnboarding: false,
              });
              setOnboardingStep(0);
            }}
            className="mt-4 text-[#FF4500] text-sm hover:underline"
          >
            Reset Onboarding
          </button>
        </div>
      </div>
    </div>
  );
}
