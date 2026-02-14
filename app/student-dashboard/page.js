"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Oswald } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function StudentDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    rank: 0,
  });

  const [leaderboard, setLeaderboard] = useState([]);
  const [progress, setProgress] = useState([]);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "student") {
      router.push("/register");
    }

    // Dummy Data (replace with Firestore later)
    setStats({
      totalQuizzes: 5,
      averageScore: 84,
      rank: 2,
    });

    setLeaderboard([
      { name: "Sarah", score: 95 },
      { name: "You", score: 84 },
      { name: "John", score: 80 },
    ]);

    setProgress([
      { title: "Math Quiz", completion: 100 },
      { title: "Science Quiz", completion: 70 },
      { title: "History Quiz", completion: 50 },
    ]);

    setUpcomingQuizzes([
      { title: "Geography Quiz", date: "March 20" },
      { title: "Physics Quiz", date: "March 25" },
    ]);
  }, [router]);

  return (
    <div
      className={`${oswald.className} min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 px-6 py-10`}
    >
      <Navbar />

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-semibold text-slate-800">
            Student Dashboard
          </h1>
          <img
            src="/student-removebg-preview.png"
            alt="Student Dashboard"
            className="h-40 w-40"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-emerald-100">
            <h3 className="text-slate-600 mb-2">Total Quizzes</h3>
            <p className="text-3xl font-semibold text-emerald-600">
              {stats.totalQuizzes}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-emerald-100">
            <h3 className="text-slate-600 mb-2">Average Score</h3>
            <p className="text-3xl font-semibold text-emerald-600">
              {stats.averageScore}%
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-emerald-100">
            <h3 className="text-slate-600 mb-2">Leaderboard Rank</h3>
            <p className="text-3xl font-semibold text-emerald-600">
              #{stats.rank}
            </p>
          </div>
        </div>

        {/* My Progress */}
        <div className="bg-white rounded-3xl shadow-md border border-emerald-100 p-8 mb-10">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            My Progress
          </h2>

          <div className="space-y-6">
            {progress.map((quiz, index) => (
              <div key={index}>
                <p className="text-slate-700 mb-2">{quiz.title}</p>
                <div className="w-full bg-emerald-100 rounded-full h-3">
                  <div
                    className="bg-emerald-500 h-3 rounded-full"
                    style={{ width: `${quiz.completion}%` }}
                  ></div>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {quiz.completion}% completed
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-3xl shadow-md border border-emerald-100 p-8 mb-10">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            Leaderboard
          </h2>

          <div className="space-y-4">
            {leaderboard.map((user, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-emerald-50 p-4 rounded-xl"
              >
                <span className="font-medium text-slate-700">
                  {index + 1}. {user.name}
                </span>
                <span className="text-emerald-600 font-semibold">
                  {user.score}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Quizzes */}
        <div className="bg-white rounded-3xl shadow-md border border-emerald-100 p-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            Upcoming Quizzes
          </h2>

          <div className="space-y-4">
            {upcomingQuizzes.map((quiz, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-slate-50 p-4 rounded-xl"
              >
                <span className="text-slate-700">{quiz.title}</span>
                <span className="text-slate-500 text-sm">{quiz.date}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
