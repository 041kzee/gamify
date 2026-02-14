"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Oswald } from "next/font/google";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import Footer from "../components/Footer";
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
  const fetchAnalytics = async () => {
    try {
      // 🔹 Get total quizzes
      const quizzesSnapshot = await getDocs(collection(db, "quizzes"));
      const totalQuizzes = quizzesSnapshot.size;

      // 🔹 Get all quiz results
      const resultsSnapshot = await getDocs(
        collection(db, "quizResults")
      );

      const results = resultsSnapshot.docs.map((doc) => doc.data());

      const studentMap = {};
      let overallScore = 0;
      let overallTotal = 0;

      results.forEach((result) => {
        const name = result.name || "Unknown";
        const score = Number(result.score) || 0;
        const total = Number(result.total) || 0;
        const quizId = result.quizId;

        overallScore += score;
        overallTotal += total;

        if (!studentMap[name]) {
          studentMap[name] = {
            quizIds: new Set(),
            totalScore: 0,
            totalMarks: 0,
          };
        }

        // Avoid duplicate attempts counting multiple times
        if (quizId) {
          studentMap[name].quizIds.add(quizId);
        }

        studentMap[name].totalScore += score;
        studentMap[name].totalMarks += total;
      });

      const totalStudents = Object.keys(studentMap).length;

      const avgScore =
        overallTotal > 0
          ? ((overallScore / overallTotal) * 100).toFixed(1)
          : 0;

      const studentAnalytics = Object.entries(studentMap).map(
        ([name, data]) => ({
          id: name,
          name,
          progress:
            totalQuizzes > 0
              ? Math.round(
                  (data.quizIds.size / totalQuizzes) * 100
                )
              : 0,
          avgScore:
            data.totalMarks > 0
              ? Math.round(
                  (data.totalScore / data.totalMarks) * 100
                )
              : 0,
        })
      );

      setAnalytics({
        totalStudents,
        avgScore,
        completedQuizzes: results.length,
      });

      setStudents(studentAnalytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  fetchAnalytics();
}, []);


  const handleCreateQuiz = () => {
    if (!quizTitle) return;
    alert(`Quiz "${quizTitle}" created successfully!`);
    setQuizTitle("");
    router.push("/create-quiz");
  };

  return (
    <div
      className={`${oswald.className} min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 px-6 py-10`}
    >
      <Navbar />

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-semibold text-slate-800">
            Teacher Dashboard
          </h1>
          <img
            src="/teacher1.png"
            alt="Teacher Dashboard"
            className="h-40 w-40"
          />
        </div>

        {/* Create Quiz */}
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

        {/* Analytics Cards */}
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

        {/* Student Progress */}
        <div className="bg-white rounded-3xl shadow-md border border-emerald-100 p-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            Student Progress
          </h2>

          <div className="space-y-6">
            {students.map((student) => (
              <div key={student.id}>
                <p className="text-slate-700 mb-2 font-medium">
                  {student.name} (Avg: {student.avgScore}%)
                </p>

                <div className="w-full bg-emerald-100 rounded-full h-3">
                  <div
                    className="bg-emerald-500 h-3 rounded-full"
                    style={{ width: `${student.progress}%` }}
                  ></div>
                </div>

                <p className="text-sm text-slate-500 mt-1">
                  {student.progress}% quizzes completed
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
