"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Oswald } from "next/font/google";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
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
    const fetchData = async () => {
      try {
        // 1️⃣ Fetch quizzes
        const quizSnapshot = await getDocs(collection(db, "quizzes"));
        const quizzes = quizSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUpcomingQuizzes(quizzes);

        // 2️⃣ Fetch leaderboard from quizResults collection
        const leaderboardQuery = query(
          collection(db, "quizResults"),
          orderBy("score", "desc")
        );

        const resultSnapshot = await getDocs(leaderboardQuery);

        const results = resultSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 3️⃣ Set top 10 users
        setLeaderboard(results.slice(0, 10));

        // 4️⃣ Calculate average percentage
        const avg =
          results.length > 0
            ? Math.round(
                results.reduce(
                  (acc, curr) => acc + (curr.score / curr.total) * 100,
                  0
                ) / results.length
              )
            : 0;

        // 5️⃣ Example rank (replace with logged-in user name later)
        const currentUserName = "You"; // Replace with actual logged-in user name

        const rankIndex = results.findIndex(
          (r) => r.name === currentUserName
        );

        setStats({
          totalQuizzes: quizzes.length,
          averageScore: avg,
          rank: rankIndex !== -1 ? rankIndex + 1 : 0,
        });

        // 6️⃣ Progress (default 0% for now)
        setProgress(
          quizzes.map((quiz) => ({
            title: quiz.title,
            completion: 0,
          }))
        );
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

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

        {/* Stats */}
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

       {/* Progress */}
<div className="bg-white rounded-3xl shadow-md border border-emerald-100 p-8 mb-10">
  <h2 className="text-2xl font-semibold text-slate-800 mb-6">
    My Progress
  </h2>

  <div className="space-y-6">
    {progress.map((quiz) => (
      <div key={quiz.title}>
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
                key={user.id}
                className="flex justify-between items-center bg-emerald-50 p-4 rounded-xl"
              >
                <span className="font-medium text-slate-700">
                  {index + 1}. {user.name}
                </span>
                <span className="text-emerald-600 font-semibold">
                  {Math.round((user.score / user.total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Available Quizzes */}
        <div className="bg-white rounded-3xl shadow-md border border-emerald-100 p-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            Available Quizzes
          </h2>

          <div className="space-y-4">
            {upcomingQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="flex justify-between items-center bg-slate-50 p-4 rounded-xl cursor-pointer hover:bg-emerald-50 transition"
                onClick={() => router.push(`/take-quiz/${quiz.id}`)}
              >
                <span className="text-slate-700 font-medium">
                  {quiz.title}
                </span>
                <span className="text-emerald-600 text-sm">
                  Take Quiz →
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
