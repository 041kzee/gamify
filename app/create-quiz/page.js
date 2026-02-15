"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Oswald } from "next/font/google";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "../lib/firebase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const db = getFirestore(app);
const auth = getAuth(app);

export default function CreateQuiz() {
  const router = useRouter();

  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      difficulty: "medium",
    },
  ]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "teacher") {
      router.push("/register");
    }
  }, [router]);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        difficulty: "medium",
      },
    ]);
  };

  const handleSaveQuiz = async () => {
    if (!quizTitle.trim()) return alert("Enter quiz title");

    try {
      const user = auth.currentUser;
      if (!user) return alert("Not logged in");

      // Create quiz document
      const quizRef = await addDoc(collection(db, "quizzes"), {
        title: quizTitle.trim(),
        teacherId: user.uid,
        createdAt: serverTimestamp(),
      });

      // Save questions
      for (let q of questions) {
        if (
          !q.questionText.trim() ||
          q.options.some((opt) => !opt.trim()) ||
          !q.correctAnswer.trim()
        ) {
          alert("Please fill all fields for every question.");
          return;
        }

        await addDoc(
          collection(db, "quizzes", quizRef.id, "questions"),
          {
            questionText: q.questionText.trim(),
            options: q.options.map((opt) => opt.trim()),
            correctAnswer: q.correctAnswer.trim(),
            difficulty: q.difficulty,
          }
        );
      }

      alert("Quiz Created Successfully!");
      router.push("/teacher-dashboard");
    } catch (error) {
      console.error(error);
      alert("Error creating quiz");
    }
  };

  return (
    <div
      className={`${oswald.className} min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 px-6 py-10`}
    >
      <Navbar />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold text-slate-800 mb-8">
          Create New Adaptive Quiz
        </h1>

        <input
          type="text"
          placeholder="Quiz Title"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          className="w-full p-3 bg-emerald-100 border border-emerald-200 text-emerald-900 placeholder:text-emerald-500 rounded-xl mb-8 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />

        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="bg-white p-6 rounded-2xl shadow-md mb-6"
          >
            <input
              type="text"
              placeholder="Question"
              value={q.questionText}
              onChange={(e) =>
                handleQuestionChange(
                  qIndex,
                  "questionText",
                  e.target.value
                )
              }
              className="w-full p-3 bg-emerald-100 border border-emerald-200 text-emerald-900 placeholder:text-emerald-500 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />

            {/* Difficulty Selector */}
            <select
              value={q.difficulty}
              onChange={(e) =>
                handleQuestionChange(
                  qIndex,
                  "difficulty",
                  e.target.value
                )
              }
              className="w-full p-2 bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {q.options.map((option, oIndex) => (
              <input
                key={oIndex}
                type="text"
                placeholder={`Option ${oIndex + 1}`}
                value={option}
                onChange={(e) =>
                  handleOptionChange(
                    qIndex,
                    oIndex,
                    e.target.value
                  )
                }
                className="w-full p-2 bg-emerald-100 border border-emerald-200 text-emerald-900 placeholder:text-emerald-500 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            ))}

            <input
              type="text"
              placeholder="Correct Answer (must match one option exactly)"
              value={q.correctAnswer}
              onChange={(e) =>
                handleQuestionChange(
                  qIndex,
                  "correctAnswer",
                  e.target.value
                )
              }
              className="w-full p-2 bg-emerald-100 border border-emerald-200 text-emerald-900 placeholder:text-emerald-500 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        ))}

        <button
          onClick={addQuestion}
          className="bg-slate-500 text-white px-6 py-2 rounded-xl mr-4"
        >
          Add Question
        </button>

        <button
          onClick={handleSaveQuiz}
          className="bg-emerald-600 text-white px-6 py-2 rounded-xl"
        >
          Save Quiz
        </button>
      </div>

      <Footer />
    </div>
  );
}
