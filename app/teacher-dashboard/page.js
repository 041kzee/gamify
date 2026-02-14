"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Oswald } from "next/font/google";
import Footer from "../components/Footer"
import Navbar from "../components/Navbar";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function TeacherDashboard() {
  const router = useRouter();

  const [quizTitle, setQuizTitle] = useState("");
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    avgScore: 0,
    completedQuizzes: 0,
  });

  const [students, setStudents] = useState([]);

  useEffect(() => {
   

    setAnalytics({
      totalStudents: 0,
      avgScore: 0,
      completedQuizzes: 0,
    });

    setStudents([
      { name: "Sarah", progress: 90 },
      { name: "John", progress: 75 },
      { name: "Aisha", progress: 88 },
    ]);
  }, [router]);

  const handleCreateQuiz = () => {
    if (!quizTitle) return;
    alert(`Quiz "${quizTitle}" created successfully!`);
    setQuizTitle("");
    router.push("/create-quiz");
  };

  return (
    <div className={`${oswald.className} min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 px-6 py-10`}>
        <Navbar/>
      
      <div className="max-w-6xl mx-auto">
<div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-semibold text-slate-800 mb-10">
          Teacher Dashboard
        </h1>
  <img src="/teacher1.png" alt="Teacher Dashboard" className="h-40 w-40" />
</div>

        <div className="bg-white rounded-3xl shadow-md border border-emerald-100 p-8 mb-10">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            Create Quiz
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter Quiz Title"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="flex-1 p-3 rounded-xl bg-emerald-50 border border-emerald-100 focus:ring-2 focus:ring-emerald-300 outline-none"
            />

            <button
              onClick={handleCreateQuiz}
              className="bg-emerald-500 text-white px-6 py-3 rounded-xl hover:bg-emerald-600 transition"
            >
              Create
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-emerald-100">
            <h3 className="text-slate-600 mb-2">Total Students</h3>
            <p className="text-3xl font-semibold text-emerald-600">
              {analytics.totalStudents}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-emerald-100">
            <h3 className="text-slate-600 mb-2">Average Score</h3>
            <p className="text-3xl font-semibold text-emerald-600">
              {analytics.avgScore}%
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-emerald-100">
            <h3 className="text-slate-600 mb-2">Completed Quizzes</h3>
            <p className="text-3xl font-semibold text-emerald-600">
              {analytics.completedQuizzes}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-md border border-emerald-100 p-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            Student Progress
          </h2>

          <div className="space-y-6">
            {students.map((student, index) => (
              <div key={index}>
                <p className="text-slate-700 mb-2">{student.name}</p>
                <div className="w-full bg-emerald-100 rounded-full h-3">
                  <div
                    className="bg-emerald-500 h-3 rounded-full"
                    style={{ width: `${student.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {student.progress}% completed
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
