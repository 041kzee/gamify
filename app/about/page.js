"use client";

import { Oswald } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function About() {
  return (
    <div
      className={`${oswald.className} min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 px-6 py-10`}
    >
      <Navbar />

      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-semibold text-slate-800 mb-8">
          About Our Platform
        </h1>

        <div className="bg-white p-8 rounded-2xl shadow-md space-y-6 text-slate-700 leading-relaxed">

          <p>
            Our platform is designed to empower teachers and students by making
            quiz creation and participation simple, interactive, and efficient.
            Teachers can easily create quizzes, manage questions, and track
            performance — all in one place.
          </p>

          <p>
            We focus on delivering a smooth and intuitive experience with a
            modern interface. Whether you're creating assessments or testing
            your knowledge, our system ensures everything runs seamlessly.
          </p>

          <p>
            Built with modern web technologies, this platform emphasizes speed,
            security, and reliability to provide the best educational
            experience possible.
          </p>

          <div className="pt-4">
            <h2 className="text-2xl font-semibold text-slate-800 mb-3">
              Our Mission
            </h2>
            <p>
              To simplify digital learning by providing educators with powerful
              yet easy-to-use tools for assessment and engagement.
            </p>
          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
}