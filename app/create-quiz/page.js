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
    { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
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
      { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  const handleSaveQuiz = async () => {
    if (!quizTitle) return alert("Enter quiz title");

    try {
      const user = auth.currentUser;
      if (!user) return alert("Not logged in");

      const quizRef = await addDoc(collection(db, "quizzes"), {
        title: quizTitle,
        teacherId: user.uid,
        createdAt: serverTimestamp(),
      });

      for (let q of questions) {
        await addDoc(collection(db, "quizzes", quizRef.id, "questions"), {
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
        });
      }

      alert("Quiz Created Successfully!");
      router.push("/teacher-dashboard");

    } catch (error) {
      console.error(error);
      alert("Error creating quiz");
    }
  };

  return (
    <div className={`${oswald.className} min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 px-6 py-10`}>
      <Navbar />

      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-semibold text-slate-800 mb-8">
          Create New Quiz
        </h1>

        <input
          type="text"
          placeholder="Quiz Title"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          className="w-full p-3 border rounded-xl mb-8"
        />

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-white p-6 rounded-2xl shadow-md mb-6">

            <input
              type="text"
              placeholder="Question"
              value={q.questionText}
              onChange={(e) =>
                handleQuestionChange(qIndex, "questionText", e.target.value)
              }
              className="w-full p-3 border rounded-lg mb-4"
            />

            {q.options.map((option, oIndex) => (
              <input
                key={oIndex}
                type="text"
                placeholder={`Option ${oIndex + 1}`}
                value={option}
                onChange={(e) =>
                  handleOptionChange(qIndex, oIndex, e.target.value)
                }
                className="w-full p-2 border rounded-lg mb-2"
              />
            ))}

            <input
              type="text"
              placeholder="Correct Answer"
              value={q.correctAnswer}
              onChange={(e) =>
                handleQuestionChange(qIndex, "correctAnswer", e.target.value)
              }
              className="w-full p-2 border rounded-lg mt-2"
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
