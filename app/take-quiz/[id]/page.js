"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Oswald } from "next/font/google";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function TakeQuizPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [usedQuestions, setUsedQuestions] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");

  // 🔥 NEW: Track performance by difficulty
  const [performance, setPerformance] = useState({
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 },
  });

  // Fetch quiz
  useEffect(() => {
    if (!id) return;

    const fetchQuiz = async () => {
      try {
        const quizRef = doc(db, "quizzes", id);
        const quizSnap = await getDoc(quizRef);

        if (!quizSnap.exists()) {
          setLoading(false);
          return;
        }

        const quizData = quizSnap.data();

        const questionsRef = collection(db, "quizzes", id, "questions");
        const questionsSnap = await getDocs(questionsRef);

        const questions = questionsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setQuiz({
          ...quizData,
          questions,
        });

        const firstQuestion = getNextQuestion(
          questions,
          "medium",
          new Set()
        );

        setCurrentQuestion(firstQuestion);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const getNextQuestion = (questions, level, used) => {
    const filtered = questions.filter(
      (q) => q.difficulty === level && !used.has(q.id)
    );

    if (filtered.length === 0) return null;

    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  // 🔥 Adaptive + performance tracking
  const handleAnswer = (option) => {
    if (!currentQuestion || submitted) return;

    const isCorrect = option === currentQuestion.correctAnswer;

    const difficultyPoints = {
      easy: 1,
      medium: 2,
      hard: 3,
    };

    let newScore = score;
    let nextDifficulty = difficulty;

    // Update performance tracking
    setPerformance((prev) => {
      const updated = { ...prev };
      updated[difficulty].total += 1;
      if (isCorrect) {
        updated[difficulty].correct += 1;
      }
      return updated;
    });

    if (isCorrect) {
      newScore += difficultyPoints[difficulty];

      nextDifficulty =
        difficulty === "easy"
          ? "medium"
          : difficulty === "medium"
          ? "hard"
          : "hard";
    } else {
      nextDifficulty =
        difficulty === "hard"
          ? "medium"
          : difficulty === "medium"
          ? "easy"
          : "easy";
    }

    setScore(newScore);
    setAnsweredCount((prev) => prev + 1);
    setDifficulty(nextDifficulty);

    const updatedUsed = new Set(usedQuestions);
    updatedUsed.add(currentQuestion.id);
    setUsedQuestions(updatedUsed);

    const nextQ = getNextQuestion(
      quiz.questions,
      nextDifficulty,
      updatedUsed
    );

    if (nextQ) {
      setCurrentQuestion(nextQ);
    } else {
      generatePersonalizedFeedback(newScore);
      setSubmitted(true);
    }
  };

  // 🔥 Personalized Feedback Generator
  const generatePersonalizedFeedback = (finalScore) => {
    const percentage =
      answeredCount === 0
        ? 0
        : (finalScore / (answeredCount * 3)) * 100;

    let message = "";

    if (percentage >= 80) {
      message =
        "🌟 Outstanding performance! You handled higher difficulty questions confidently. You're ready for advanced challenges!";
    } else if (percentage >= 60) {
      if (
        performance.hard.total > 0 &&
        performance.hard.correct <
          performance.hard.total / 2
      ) {
        message =
          "👍 Good job! You perform well on easier questions. Focus on mastering hard-level concepts to improve further.";
      } else {
        message =
          "Nice effort! With a bit more practice, you can reach top-level mastery.";
      }
    } else {
      message =
        "📘 You should revisit foundational concepts. Strengthen easy-level topics first, then move up gradually.";
    }

    setFeedback(message);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Please enter your name before submitting.");
      return;
    }

    try {
      await addDoc(collection(db, "quizResults"), {
        quizId: id,
        name: name.trim(),
        score,
        total: answeredCount,
        performance,
        feedback,
        createdAt: serverTimestamp(),
      });

      alert("Result saved successfully!");
      router.push("/student-dashboard");
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to save result.");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-xl text-center">
        Loading quiz...
      </div>
    );

  if (!quiz)
    return (
      <div className="p-10 text-xl text-center">
        Quiz not found.
      </div>
    );

  return (
    <div
      className={`${oswald.className} min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-10`}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-8">
          {quiz.title}
        </h1>



        {!submitted && (
          <div className="mb-6">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full md:w-1/2 p-3 border rounded-lg"
            />
          </div>
        )}

        {currentQuestion && !submitted && (
          <div className="mb-6 p-6 bg-white rounded-2xl shadow-md border border-emerald-100">
            <div className="mb-3 text-sm text-slate-500">
              Difficulty: {difficulty.toUpperCase()}
            </div>

            <h2 className="font-medium text-slate-800 mb-4">
              {currentQuestion.questionText}
            </h2>

            {currentQuestion.options?.map((option, i) => (
              <div
                key={i}
                className="p-3 border rounded-lg mb-2 cursor-pointer hover:bg-emerald-100 transition bg-emerald-50"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}

        {submitted && (
          <div className="text-center bg-white p-8 rounded-2xl shadow-md">
            <p className="text-2xl font-semibold mb-4">
              Quiz Completed!
            </p>

            <p className="text-xl mb-4">
              Final Adaptive Score: {score}
            </p>

            <p className="text-lg text-slate-700 mb-6">
              {feedback}
            </p>

            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition"
            >
              Save Result
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
