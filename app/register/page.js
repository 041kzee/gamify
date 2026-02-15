"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Oswald } from "next/font/google";
import { updateProfile } from "firebase/auth";


const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await updateProfile(userCredential.user, {
        displayName: form.name,
      });

      localStorage.setItem("role", form.role);

      if (form.role === "teacher") {
        router.push("/teacher-dashboard");
      } else {
        router.push("/student-dashboard");
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={`${oswald.className} min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-slate-50 px-6`}>

      <div className="max-w-[1100px] w-full bg-white rounded-3xl shadow-xl flex overflow-hidden border border-emerald-100">

        <div className="hidden md:flex w-1/2 items-center justify-center bg-emerald-50">
          <img
            src="/student-removebg-preview.png"
            alt="Register Illustration"
            className="w-72 md:w-96"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-12 py-12"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-6">
            Create Account
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="mb-4 p-3 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-900 placeholder:text-emerald-500 focus:ring-2 focus:ring-emerald-300 outline-none"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="mb-4 p-3 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-900 placeholder:text-emerald-500 focus:ring-2 focus:ring-emerald-300 outline-none"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="mb-4 p-3 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-900 placeholder:text-emerald-500 focus:ring-2 focus:ring-emerald-300 outline-none"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            className="mb-6 p-3 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-900 placeholder:text-emerald-500 focus:ring-2 focus:ring-emerald-300 outline-none"
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          <button
            type="submit"
            className="bg-emerald-500 text-white py-3 rounded-full font-medium hover:bg-emerald-600 transition"
          >
            Register
          </button>
        </form>

      </div>
    </div>
  );
}
