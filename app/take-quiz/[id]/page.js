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
  const [maxPossibleScore, setMaxPossibleScore] = useState(0);
  const [answerHistory, setAnswerHistory] = useState([]);

  const HAPPY_PANDA_URL = "/happy-removebg-preview.png";
  const SAD_PANDA_URL = "/sad-removebg-preview.png";
  const happyText = "Great job! Your hard work is making this panda happy. Keep it up!";
  const sadText = "Don't worry! Every mistake is a step towards learning. This panda believes in you!";

  const [performance, setPerformance] = useState({
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 },
  });

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

        setQuiz({ ...quizData, questions });

        const firstQuestion =
          questions[Math.floor(Math.random() * questions.length)];
        setCurrentQuestion(firstQuestion);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const generateWeaknessSummary = async (finalScore, finalMaxScore, history) => {
    try {
      const response = await fetch("/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: history,
          finalScore,
          maxScore: finalMaxScore,
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      setFeedback(data.summary);
    } catch (error) {
      console.error("Error generating summary:", error);
      setFeedback("We couldn't generate a learning summary right now.");
    }
  };

  const handleAnswer = (option) => {
    if (!currentQuestion || submitted) return;

    const isCorrect = option === currentQuestion.correctAnswer;
    const difficultyPoints = { easy: 1, medium: 2, hard: 3 };

    let newScore = score;
    let nextDifficulty = difficulty;
    const questionPoints = difficultyPoints[difficulty];
    const newMaxScore = maxPossibleScore + questionPoints;

    setPerformance((prev) => {
      const updated = { ...prev };
      updated[difficulty].total += 1;
      if (isCorrect) updated[difficulty].correct += 1;
      return updated;
    });

    if (isCorrect) {
      newScore += questionPoints;
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

    const newHistory = [
      ...answerHistory,
      {
        question: currentQuestion.questionText,
        selected: option,
        correct: currentQuestion.correctAnswer,
        difficulty,
        isCorrect,
      },
    ];

    setAnswerHistory(newHistory);
    setMaxPossibleScore(newMaxScore);
    setScore(newScore);
    setAnsweredCount((prev) => prev + 1);
    setDifficulty(nextDifficulty);

    const updatedUsed = new Set(usedQuestions);
    updatedUsed.add(currentQuestion.id);
    setUsedQuestions(updatedUsed);

    const remaining = quiz.questions.filter(
      (q) => !updatedUsed.has(q.id)
    );

    if (updatedUsed.size === quiz.questions.length) {
      setSubmitted(true);
<<<<<<< HEAD
      generateWeaknessSummary(newScore, newMaxScore, newHistory);
=======
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
>>>>>>> ace4e0e02df1390e506a71d4bfa01a5bc08e3229
    } else {
      setCurrentQuestion(
        remaining[Math.floor(Math.random() * remaining.length)]
      );
    }
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

  const isPerfectScore =
    answeredCount > 0 && score === maxPossibleScore;

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold text-emerald-700">
        Loading quiz...
      </div>
    );

  if (!quiz)
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold text-emerald-700">
        Quiz not found.
      </div>
    );

  return (
    <div
      className={`${oswald.className} min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-6`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-emerald-100">

          <h1 className="text-4xl font-semibold text-emerald-800 mb-6 text-center">
            {quiz.title}
          </h1>

<<<<<<< HEAD
          {!submitted && (
            <div className="mb-6">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-4 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              />
=======

        {!submitted && (
          <div className="mb-6">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full md:w-1/2 p-3 bg-emerald-100 border border-emerald-200 text-emerald-900 placeholder:text-emerald-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        )}

        {currentQuestion && !submitted && (
          <div className="mb-6 p-6 bg-white rounded-2xl shadow-md border border-emerald-100">
            <div className="mb-3 text-sm text-slate-500">
              Difficulty: {difficulty.toUpperCase()}
>>>>>>> ace4e0e02df1390e506a71d4bfa01a5bc08e3229
            </div>
          )}

          {!submitted && (
            <div className="mb-4 text-sm text-emerald-600 text-center font-medium">
              Question {answeredCount + 1} of {quiz.questions.length}
            </div>
          )}

          {currentQuestion && !submitted && (
            <div className="p-6 bg-white rounded-2xl shadow-md border border-emerald-100">

              <div className="mb-3 text-xs font-semibold tracking-wider text-emerald-600 uppercase">
                Difficulty: {difficulty}
              </div>

              <h2 className="text-lg font-medium mb-6 text-slate-800">
                {currentQuestion.questionText}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options?.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(option)}
                    className="w-full p-4 text-left rounded-xl bg-emerald-50 hover:bg-emerald-100 transition shadow-sm border border-emerald-100"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {submitted && (
            <div className="text-center space-y-6">

              <img
                src={isPerfectScore ? HAPPY_PANDA_URL : SAD_PANDA_URL}
                alt="Panda"
                className="w-52 mx-auto"
              />

              <p className="text-lg font-medium text-emerald-700">
                {isPerfectScore ? happyText : sadText}
              </p>

              <p className="text-2xl font-semibold text-emerald-800">
                Final Adaptive Score: {score}
              </p>

              <div className="bg-emerald-50 p-6 rounded-2xl shadow-inner text-slate-700 whitespace-pre-line border border-emerald-100">
                {feedback}
              </div>

              <button
                onClick={handleSubmit}
                className="px-10 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition shadow-md"
              >
                Save Result
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
