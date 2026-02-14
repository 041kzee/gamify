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
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchQuiz = async () => {
      try {
        // Fetch quiz main document
        const quizRef = doc(db, "quizzes", id);
        const quizSnap = await getDoc(quizRef);

        if (!quizSnap.exists()) {
          console.log("Quiz not found");
          setLoading(false);
          return;
        }

        const quizData = quizSnap.data();

        // Fetch subcollection questions
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
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  // Select answer
  const handleSelectOption = (qIndex, option) => {
    if (submitted) return;

    setAnswers((prev) => ({
      ...prev,
      [qIndex]: option,
    }));
  };

  // Submit quiz
  const handleSubmit = async () => {
    if (!quiz) return;

    if (!name.trim()) {
      alert("Please enter your name before submitting.");
      return;
    }

    // Calculate final score properly
    let calculatedScore = 0;

    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        calculatedScore++;
      }
    });

    try {
      await addDoc(collection(db, "quizResults"), {
        quizId: id,
        name: name.trim(),
        score: calculatedScore,
        total: quiz.questions.length,
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);

      alert(
        `Quiz submitted! Your score: ${calculatedScore}/${quiz.questions.length}`
      );
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz. Try again.");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-xl text-center">Loading quiz...</div>
    );

  if (!quiz)
    return (
      <div className="p-10 text-xl text-center">Quiz not found.</div>
    );

  return (
    <div
      className={`${oswald.className} min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-10`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-800">
            {quiz.title}
          </h1>
          <img
            src="/student-removebg-preview.png"
            alt="Quiz Illustration"
            className="h-24 md:h-32"
          />
        </div>

        {/* Name Input */}
        {!submitted && (
          <div className="mb-6">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full md:w-1/2 p-3 border rounded-lg mb-2"
            />
          </div>
        )}

        {/* Questions */}
        {quiz.questions?.length > 0 ? (
          quiz.questions.map((q, index) => {
            const selected = answers[index];
            const correct = q.correctAnswer;

            return (
              <div
                key={q.id}
                className="mb-6 p-6 bg-white rounded-2xl shadow-md border border-emerald-100"
              >
                <div className="flex items-center mb-4">
                  <span className="font-semibold text-slate-700 mr-2">
                    {index + 1}.
                  </span>
                  <h2 className="font-medium text-slate-800">
                    {q.questionText}
                  </h2>
                </div>

                {q.options?.map((option, i) => {
                  let bgClass = "bg-emerald-50";

                  if (submitted) {
                    if (option === correct)
                      bgClass = "bg-green-300";
                    else if (
                      option === selected &&
                      option !== correct
                    )
                      bgClass = "bg-red-300";
                  } else if (option === selected) {
                    bgClass = "bg-emerald-200";
                  }

                  return (
                    <div
                      key={`${q.id}-${i}`}
                      className={`p-3 border rounded-lg mb-2 cursor-pointer hover:bg-emerald-100 transition ${bgClass}`}
                      onClick={() =>
                        handleSelectOption(index, option)
                      }
                    >
                      {option}
                    </div>
                  );
                })}
              </div>
            );
          })
        ) : (
          <p className="text-xl text-center">
            No questions available for this quiz.
          </p>
        )}

        {/* Submit Button */}
        {quiz.questions?.length > 0 && !submitted && (
          <button
            onClick={handleSubmit}
            className="mt-6 w-full md:w-auto px-8 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition"
          >
            Submit Quiz
          </button>
        )}

        {/* After Submission */}
        {submitted && (
          <>
            <p className="mt-6 text-xl md:text-2xl font-semibold text-slate-800 text-center">
              Quiz submitted successfully!
            </p>

            <button
              onClick={() => router.push("/student-dashboard")}
              className="mt-6 w-full md:w-auto px-8 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition"
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
