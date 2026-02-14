"use client"
import React from 'react';
import { useState } from 'react';
import { Oswald } from 'next/font/google';
const oswald = Oswald({ subsets: ['latin'], weight: '400' });
import {useRouter} from 'next/navigation'
import Footer from './components/Footer'
export default function LandingPage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const router = useRouter();
 
  return (
   
    <div className={ `${oswald.className} min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50` } >
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" className="h-20 w-20" alt="PandaLearn Logo" />
            <span className="text-2xl font-bold text-slate-800">PandaLearn</span>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors">
              Login
            </button>
            <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-20 justify-center items-center">
        <div className="max-w-6xl mx-auto">
          {/* Title & Description */}
          <div className="text-center mb-16 justify-center items-center">
            <div className="flex justify-center items-center mb-4">
            <img src="/panda-removebg-preview.png" className="h-70 w-70 " alt="PandaLearn Logo" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Bamboo your BrainPower!
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Gamified adaptive learning platform that makes education fun and engaging. 
              Track progress, compete on leaderboards, and get AI-powered feedback.
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-12">
            <h2 className="text-center text-2xl font-semibold text-slate-800 mb-8">
              Choose Your Role
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Student Card */}
              <div
                onClick={() => setSelectedRole('student')}
                className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedRole === 'student'
                    ? 'border-emerald-500 bg-emerald-50 shadow-lg scale-105'
                    : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md'
                }`}
              >
                <div className="text-center">
                  <img src="/student-removebg-preview.png" className="h-30 w-30 mx-auto mb-4" alt="Student Icon" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Student</h3>
                  <p className="text-slate-600 mb-4">
                    Take quizzes, earn points, and climb the leaderboard
                  </p>
                  <ul className="text-left text-sm text-slate-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-500">✓</span>
                      Adaptive quiz difficulty
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-500">✓</span>
                      Real-time leaderboards
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-500">✓</span>
                      AI-powered feedback
                    </li>
                  </ul>
                </div>
              </div>

              {/* Teacher Card */}
              <div
                onClick={() => setSelectedRole('teacher')}
                className={`p-8 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedRole === 'teacher'
                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="text-center">
                  <img src="/teacher1.png" className="h-30 w-30 mx-auto mb-4" alt="Teacher Icon" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Teacher</h3>
                  <p className="text-slate-600 mb-4">
                    Create quizzes, track analytics, and monitor student progress
                  </p>
                  <ul className="text-left text-sm text-slate-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500">✓</span>
                      Easy quiz creation
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500">✓</span>
                      Performance analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500">✓</span>
                      Student insights
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              disabled={!selectedRole}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                selectedRole
                  ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
              onClick={() => router.push(selectedRole === 'student' ? '/student-dashboard' : '/teacher-dashboard')}
            >
              {selectedRole ? `Continue as ${selectedRole === 'student' ? 'Student' : 'Teacher'}` : 'Select a Role'}
            </button>
            <button className="px-8 py-4 text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Already have an account? <span className="text-emerald-600 font-semibold cursor-pointer" onClick={() => router.push('/login')}>Login</span>
            </button>
          </div>
        </div>
      </main>

    
     <Footer/>
    </div>
  );
}