"use client";

import { Oswald } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function Features() {
  return (
    <div
      className={`${oswald.className} min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 px-6 py-10`}
    >
      <Navbar />

      <div className="flex flex-row">
        <div className="max-w-4xl mx-auto flex-1">

          <h1 className="text-4xl font-semibold text-slate-800 mb-8">
            Platform Features
          </h1>

          <div className="bg-white p-8 rounded-2xl shadow-md space-y-6 text-slate-700 leading-relaxed">

            <p>
              Our platform provides powerful tools for both teachers and students,
              making online assessments simple, efficient, and engaging.
            </p>

            <div className="pt-4">
              <h2 className="text-2xl font-semibold text-slate-800 mb-3">
                Quiz Creation
              </h2>
              <p>
                Teachers can easily create quizzes with multiple questions,
                customizable options, and correct answer selection — all in a
                streamlined interface.
              </p>
            </div>

            <div className="pt-4">
              <h2 className="text-2xl font-semibold text-slate-800 mb-3">
                Real-Time Evaluation
              </h2>
              <p>
                Students receive instant results after submission, allowing them
                to understand their performance immediately.
              </p>
            </div>

            <div className="pt-4">
              <h2 className="text-2xl font-semibold text-slate-800 mb-3">
                AI-Powered Feedback
              </h2>
              <p>
                Personalized AI feedback helps students improve by providing
                tailored suggestions based on their quiz performance.
              </p>
            </div>

            <div className="pt-4">
              <h2 className="text-2xl font-semibold text-slate-800 mb-3">
                Secure & Reliable
              </h2>
              <p>
                Built with modern technologies, the platform ensures secure data
                storage, reliable performance, and a smooth user experience.
              </p>
            </div>

          </div>

        </div>

        <div className="flex-1">
          <img src="teacher1.png" alt="Features Illustration" />
        </div>
      </div>

      <Footer />
    </div>
  );
}
